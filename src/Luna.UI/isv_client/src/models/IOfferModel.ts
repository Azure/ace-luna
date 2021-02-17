import {IBaseModel} from "./IBaseModel";

export interface IOfferModel extends IBaseModel {
  offerName: string;
  offerAlias: string;
  offerVersion: string;
  owners: string;
  hostSubscription: string;
  status: string;
  createdTime?: string;
  lastUpdatedTime?: string;
  Idlist?: string;
  selectedOfferName?:string
  selectedOfferindex?:number
}