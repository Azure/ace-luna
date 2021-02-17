export enum WebRoute {
  Home = '/',
  NoVersion = '/NoVersion',
  Offers = '/Offers',  
  ModifyOfferInfo = '/ModifyOffer/:offerName/Info',
  ModifyOfferParameters = '/ModifyOffer/:offerName/Parameters',
  ModifyOfferIpConfigs = '/ModifyOffer/:offerName/IpConfigs',
  ModifyOfferArmTemplates = '/ModifyOffer/:offerName/ArmTemplates',
  ModifyOfferWebHooks = '/ModifyOffer/:offerName/WebHooks',
  ModifyOfferMeters = '/ModifyOffer/:offerName/Meters',
  ReviewOffer = '/ReviewOffer/:offerName?',
  Subscriptions = '/Subscriptions',
  ModifyOfferPlans = '/ModifyOffer/:offerName/Plans',
  LandingPage = '/LandingPage',
  SubscriptionDetail = '/SubscriptionDetail/:offerName/:subscriptionId',
  Products = '/Products',
  ModifyProductInfo = '/ModifyProduct/:productId/Info',
  ProductDetail= '/ModifyProduct/:productId/ProductDetail'
}