using ExpenseService as service from '../srv/expense-service';

// tag::labels[]
annotate service.Claims with {
  title  @title : 'Title';
  status @title : 'Status';
  amount @title : 'Amount';
};
// end::labels[]

// tag::list[]
annotate service.Claims with @(
  UI.LineItem : [{ Value : title }, { Value : status }, { Value : amount }]
);
// end::list[]

// tag::header[]
annotate service.Claims with @(
  UI.HeaderInfo : { TypeName : 'Claim', TypeNamePlural : 'Claims', Title : { Value : title } }
);
// end::header[]

// tag::facets[]
annotate service.Claims with @(
  UI.Facets : [
    { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' },
    { $Type : 'UI.ReferenceFacet', Label : 'Administration', Target : '@UI.FieldGroup#Admin' }
  ],
  UI.FieldGroup #General : { Data : [{ Value : title }, { Value : status }, { Value : amount }] },
  UI.FieldGroup #Admin : { Data : [{ Value : createdAt }, { Value : createdBy }, { Value : modifiedAt }, { Value : modifiedBy }] }
);
// end::facets[]

// tag::valuehelp[]
annotate service.Claims with {
  status @Common.ValueList : {
    CollectionPath : 'Statuses',
    Parameters : [
      { $Type : 'Common.ValueListParameterInOut', LocalDataProperty : status, ValueListProperty : 'code' },
      { $Type : 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'name' }
    ]
  };
};
// end::valuehelp[]
