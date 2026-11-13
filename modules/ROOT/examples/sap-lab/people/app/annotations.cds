using PeopleService as service from '../srv/people-service';

// tag::labels[]
annotate service.Employees with {
  PersonnelNumber @title : 'Personnel Number';
  Name            @title : 'Name';
  EntryDate       @title : 'Entry Date';
};
annotate service.OrganizationalAssignments with {
  BeginDate        @title : 'Valid From';
  EndDate          @title : 'Valid To';
  PersonnelArea    @title : 'Personnel Area';
  PersonnelSubarea @title : 'Personnel Subarea';
  EmployeeSubgroup @title : 'Employee Subgroup';
  Position         @title : 'Position';
};
annotate service.BasicPayRecords with {
  BeginDate @title : 'Valid From';
  EndDate   @title : 'Valid To';
  PayBasis  @title : 'Pay Basis';
  Amount    @title : 'Amount';
  Currency  @title : 'Currency';
};
annotate service.ParkingPermits with {
  BeginDate @title : 'Valid From';
  EndDate   @title : 'Valid To';
  Permit    @title : 'Permit';
};
// end::labels[]

// tag::history[]
annotate service.Employees with @(
  UI.LineItem : [{ Value : PersonnelNumber }, { Value : Name }, { Value : EntryDate }],
  UI.HeaderInfo : { TypeName : 'Employee', TypeNamePlural : 'Employees', Title : { Value : Name } },
  UI.Facets : [
    { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' },
    { $Type : 'UI.ReferenceFacet', Label : 'Organizational Assignment', Target : 'OrgAssignments/@UI.LineItem' },
    { $Type : 'UI.ReferenceFacet', Label : 'Basic Pay', Target : 'BasicPay/@UI.LineItem' },
    { $Type : 'UI.ReferenceFacet', Label : 'Parking Permits', Target : 'ParkingPermits/@UI.LineItem' }
  ],
  UI.FieldGroup #General : { Data : [{ Value : PersonnelNumber }, { Value : Name }, { Value : EntryDate }] }
);
annotate service.OrganizationalAssignments with @(
  UI.LineItem : [{ Value : BeginDate }, { Value : EndDate }, { Value : PersonnelSubarea }, { Value : EmployeeSubgroup }, { Value : Position }]
);
annotate service.BasicPayRecords with @(
  UI.LineItem : [{ Value : BeginDate }, { Value : EndDate }, { Value : PayBasis }, { Value : Amount }, { Value : Currency }]
);
annotate service.ParkingPermits with @(
  UI.LineItem : [{ Value : BeginDate }, { Value : EndDate }, { Value : Permit }]
);
// end::history[]
