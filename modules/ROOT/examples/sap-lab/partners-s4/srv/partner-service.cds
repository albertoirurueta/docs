using { API_BUSINESS_PARTNER as bupa } from './external/API_BUSINESS_PARTNER';

service PartnerDashboard {
  @readonly entity Partners as projection on bupa.A_BusinessPartner {
    key BusinessPartner as ID,
    BusinessPartnerFullName as name,
    BusinessPartnerCategory as category
  };
}
