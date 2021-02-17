import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {DefaultButton, Dialog, DialogType, FontIcon, Stack} from 'office-ui-fabric-react';
import {Loading} from "../../shared/components/Loading";
import {IPlanModel} from '../../models';
import PlansService from "../../services/PlansService";
import ModifyPlan from "./ModifyPlan";
import {Formik} from "formik";
import {getInitialPlan, IPlanFormValues, planValidationSchema} from "./formUtils/planFormUtils";
import FormLabel from '../../shared/components/FormLabel';
import {handleSubmissionErrorsForArray, handleSubmissionErrorsForForm} from "../../shared/formUtils/utils";
import {toast} from "react-toastify";
import { useGlobalContext } from '../../shared/components/GlobalProvider';
import CustomMetersService from "../../services/MetersService";

const Plans: React.FunctionComponent = () => {

  const [formState, setFormState] = useState<IPlanFormValues>(getInitialPlan);
  const [setFormError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<string>("planForm");
  const [plans, setPlans] = useState<IPlanModel[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const [planDialogVisible, setPlanDialogVisible] = useState<boolean>(false);
  const [editPlanName, setEditPlanName] = useState<string>('');
  const [isNewPlanName, setIsNewPlanName] = useState<boolean>(true);

  const {offerName} = useParams();

  const OfferName = offerName as string;
  const PlanName = editPlanName as string;
  const globalContext = useGlobalContext();

  const getPlans = async () => {

    setLoadingPlans(true);
    const results = await PlansService.list(OfferName);
    if (results && !results.hasErrors && results.value)
      setPlans(results.value);
    else {
      setPlans([]);
    }

    setLoadingPlans(false);
  }

  useEffect(() => {
    getPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewPlans = (): void => {
    setIsNewPlanName(true);
    setEditPlanName('');
    showPlanDialog();
  };

  const showPlanDialog = (): void => {    
    setPlanDialogVisible(true);
  };

  const hidePlanDialog = (): void => {
    setPlanDialogVisible(false);
  };

  const editItem = (planName: string): void => {

    setIsNewPlanName(false);
    setEditPlanName(planName);
    showPlanDialog();
  };

  const Plans = ({plans}) => {
    if (!plans || plans.length === 0) {
      return <tr>
        <td colSpan={4} style={{textAlign:"center"}}><span>No plans</span></td>
      </tr>
    } else {
      return (
        plans.map((value: IPlanModel, idx) => {
          if (value.isDeleted)
            return value;

          return (
            <tr key={idx}>
              <td>
                <span style={{width: 200}}>{value.planName}</span>
              </td>
              <td>
                <span style={{width: 200}}>{value.privatePlan ? 'Private' : 'Public'}</span>
              </td>
              <td>
                <Stack
                  verticalAlign="center"
                  horizontalAlign={"space-evenly"}
                  gap={15}
                  horizontal={true}
                  styles={{
                    root: {}
                  }}
                >
                  <FontIcon iconName="Edit" className="deleteicon" onClick={() => {
                    editItem(value.planName)
                  }}/>
                </Stack>
              </td>
            </tr>
          );
        })
      );
    }
  }

  return (
    <Stack
      verticalAlign="start"
      horizontal={false}
      styles={{
        root: {
          marginLeft: 50,
          marginRight: 50,
          width: '100%',
          height: '100%',
          textAlign: 'center',
        }
      }}
    >
      <Stack
        horizontalAlign="start"
        verticalAlign="center"
        styles={{
          root: {
            width: '100%'
          }
        }}
      >
        <table id={"tblplans"} className="noborder offer">
          <thead>
          <tr style={{textAlign: "center", borderBottom: '1px solid #e8e8e8'}}>
            <th style={{width: 200}}><FormLabel title={"Plan Name"}/></th>
            <th style={{width: 200}}><FormLabel title={"Availability"}/></th>
            <th style={{width: 200}}><FormLabel title={"Operations"}/></th>
          </tr>
          </thead>
          <tbody>
          {loadingPlans ?
            (
              <tr>
                <td colSpan={4} align={"center"}>
                  <Stack verticalAlign={"center"} horizontalAlign={"center"} horizontal={true}>
                    <Loading/>
                  </Stack>
                </td>
              </tr>
            )
            : <Plans plans={plans}/>}
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={4} style={{textAlign: 'left'}}>
              <Stack style={{marginTop: 20}} horizontal={true} gap={15}>
                <DefaultButton onClick={handleNewPlans} className="addbutton">
                  <FontIcon iconName="Add" className="deleteicon"/> Add Plan
                </DefaultButton>
              </Stack>
            </td>
          </tr>
          </tfoot>
        </table>
      </Stack>
      <Dialog
        hidden={!planDialogVisible}
        dialogContentProps={{
          styles: {
            subText: {
              paddingTop: 0
            },
            title: {
              paddingBottom: 0
            }
          },
          type: DialogType.normal,
          title: isNewPlanName ? 'New Plan' : 'Modify Plan'
        }}
        modalProps={{
          isBlocking: true,
          className: 'planmodal',
          styles: {
            main: {
              minWidth: 800,
              maxWidth: 800
            },

          }
        }}
      >
        <Formik
          key={formKey}
          initialValues={formState}
          validationSchema={planValidationSchema}
          validateOnBlur={true}
          enableReinitialize={true}
          onSubmit={async (values, {setSubmitting, setErrors}) => {

            setSubmitting(true);
            globalContext.showProcessing();

            if (!editPlanName) {
              var createPlanResult = await PlansService.create(OfferName, values.plan);
              if (handleSubmissionErrorsForForm(setErrors, setSubmitting, setFormError, 'plan', createPlanResult)) {
                globalContext.hideProcessing();
                return;
              }
            } else {
              var updatePlanResult = await PlansService.update(OfferName, values.plan);
              if (handleSubmissionErrorsForForm(setErrors, setSubmitting, setFormError, 'plan', updatePlanResult)) {
                globalContext.hideProcessing();
                return;
              }
            }

            //zb: commenting this out for now per xiaochen
            /*
            if (values.plan.privatePlan) {

              // Next find all of the new parameters and attempt to create them
              let usersToCreate = values.plan.restrictedUsers.filter(x => x.isNew && !!x.isDeleted === false && !!x.isSaved === false);
              for (let user of usersToCreate) {

                var createRestrictedUserResult = await PlansService.createRestrictedUser(OfferName, values.plan.planName, user);
                //TODO: NEED TO HANDLE THE DISPLAY OF ERRORS FOR subkeys for forms
                if (!createRestrictedUserResult.success) {
                  globalContext.hideProcessing();
                  return;
                }

                // remove the delete param from the collection
                user.isNew = false;
              }
            }*/

            // save the custom meter dimension changes

            // Grab all of our modified entries before we start modifying the state of items during the saving process
            let parametersToUpdate = values.plan.customMeterDimensions.filter(x => !!x.isNew === false && !!x.isDeleted === false && !!x.isSaved === false);

            // First find all of the existing parameters that were deleted and attempt to delete them
            // We don't care about parameters that were created and deleted by the client but never saved
            let parametersToDelete = values.plan.customMeterDimensions.filter(x => x.isDeleted && !!x.isNew === false && !!x.isSaved === false);
            for (let param of parametersToDelete) {

              var paramDeleteResult = await PlansService.deleteCustomMeterDimension(offerName as string, values.plan.planName, param.meterName);
              var idx = values.plan.customMeterDimensions.findIndex(x => x.clientId === param.clientId);
              //TODO: NEED TO HANDLE THE DISPLAY OF ERRORS FOR subkeys for forms
              if (!paramDeleteResult.success) {
                globalContext.hideProcessing();
                return;
              }
              /*if (handleSubmissionErrorsForArray (setErrors, setSubmitting, setFormError, 'plan.customMeterDimensions', idx, paramDeleteResult)) {
                globalContext.hideProcessing();
                return;
              }*/

              param.isSaved = true;
            }

            // Next find all of the new parameters and attempt to create them
            let parametersToCreate = values.plan.customMeterDimensions.filter(x => x.isNew && !!x.isDeleted === false && !!x.isSaved === false);
            for (let param of parametersToCreate) {
              param.planName = values.plan.planName;
              param.annualQuantityIncludedInBase = param.monthlyQuantityIncludedInBase;
              param.annualUnlimited = param.monthlyUnlimited;

              var paramCreateResult = await PlansService.createOrUpdateCustomMeterDimension(offerName as string, param);
              var idx1 = values.plan.customMeterDimensions.findIndex(x => x.clientId === param.clientId);
              //TODO: NEED TO HANDLE THE DISPLAY OF ERRORS FOR subkeys for forms
              if (!paramCreateResult.success) {
                globalContext.hideProcessing();
                return;
              }
              /*if (handleSubmissionErrorsForArray(setErrors, setSubmitting, setFormError, 'customMeters', idx1, paramCreateResult)) {
                globalContext.hideProcessing();
                return;
              }*/

              param.isNew = false;
            }

            // Finally, find all of the existing parameters that are not new or deleted and update them
            for (let param of parametersToUpdate) {
              param.annualQuantityIncludedInBase = param.monthlyQuantityIncludedInBase;
              param.annualUnlimited = param.monthlyUnlimited;

              var paramUpdateResult = await PlansService.createOrUpdateCustomMeterDimension(offerName as string, param);
              var idx2 = values.plan.customMeterDimensions.findIndex(x => x.clientId === param.clientId);
              //TODO: NEED TO HANDLE THE DISPLAY OF ERRORS FOR subkeys for forms
              if (!paramUpdateResult.success) {
                globalContext.hideProcessing();
                return;
              }
              /*if (handleSubmissionErrorsForArray(setErrors, setSubmitting, setFormError, 'customMeters', idx1, paramCreateResult)) {
                globalContext.hideProcessing();
                return;
              }*/

              // do not mark the record as saved since the user could potentially change something about it for the next pass
              // if one of the other records had a problem
            }


            hidePlanDialog();
            globalContext.hideProcessing();
            toast.success("Success!");
            setSubmitting(false);
            getPlans();

          }}
        >
          <ModifyPlan
            planlist={plans}
            isNew={isNewPlanName}
            planName={editPlanName}
            setFormKey={setFormKey}
            offerName={offerName as string}
            formState={formState}
            setFormState={setFormState}
            hidePlanDialog={hidePlanDialog}
            refreshPlanList={() => {
              getPlans();
            }}
          />
        </Formik>
      </Dialog>
    </Stack>
  );
}
export default Plans;