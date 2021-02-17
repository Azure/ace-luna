import { ServiceBase } from "../services/ServiceBase";
import { Result } from "../models";
import { IOfferParameterModel } from "../models/IOfferParameterModel";
import { v4 as uuid } from "uuid";

export default class OfferParameterService extends ServiceBase {

  public static async list(offerName: string): Promise<Result<IOfferParameterModel[]>> {

    var result = await this.requestJson<IOfferParameterModel[]>({
      url: `/offers/${offerName}/offerParameters`,
      method: "GET"
    });

    if (!result.hasErrors && result.value) {
      result.value.map(u => u.clientId = uuid());
      result.value.map((value) => {
        if (value.valueType === 'string') {
          value.isdisablemaximum = true;
          value.isdisableminimum = true;
          if (value.valueList.length > 0) {
            value.isdisablevalueList = false;
          }
          else {
            value.isdisablevalueList = true;
          }
          value.isdisablefromList = false;
        }
        else if (value.valueType === 'number') {
          value.isdisablemaximum = false;
          value.isdisableminimum = false;
          if (value.valueList.length > 0) {
            value.isdisablevalueList = false;
          }
          else {
            value.isdisablevalueList = true;
          }
          value.isdisablefromList = false;
        }
        else if (value.valueType === 'datetime') {
          value.isdisablemaximum = true;
          value.isdisableminimum = true;
          value.isdisablevalueList = true;
          value.isdisablefromList = true;
        }
        else if (value.valueType === 'boolean') {
          value.isdisablemaximum = true;
          value.isdisableminimum = true;
          value.isdisablevalueList = true;
          value.isdisablefromList = true;
        }
        return value;
      });
    }


    return result;
  }

  public static async get(offerName: string, offerParameterName: string): Promise<Result<IOfferParameterModel>> {

    var result = await this.requestJson<IOfferParameterModel>({
      url: `/offers/${offerName}/offerParameters/${offerParameterName}`,
      method: "GET"
    });

    if (!result.hasErrors && result.value)
      result.value.clientId = uuid();

    return result;
  }

  public static async update(offerName: string, model: IOfferParameterModel): Promise<Result<IOfferParameterModel>> {
    var result = await this.requestJson<IOfferParameterModel>({
      url: `/offers/${offerName}/offerParameters/${model.parameterName}`,
      method: "PUT",
      data: model
    });

    if (!result.hasErrors && result.value)
      result.value.clientId = uuid();

    return result;
  }

  public static async delete(offerName: string, offerParameterName: string): Promise<Result<{}>> {
    var result = await this.requestJson<Result<{}>>({
      url: `/offers/${offerName}/offerParameters/${offerParameterName}`,
      method: "DELETE"
    });
    return result;
  }

  public static async create(offerName: string, model: IOfferParameterModel): Promise<Result<IOfferParameterModel>> {

    var result = await this.requestJson<IOfferParameterModel>({
      url: `/offers/${offerName}/offerParameters/${model.parameterName}`,
      method: "PUT",
      data: model
    });

    if (!result.hasErrors && result.value)
      result.value.clientId = uuid();

    return result;
  }
}