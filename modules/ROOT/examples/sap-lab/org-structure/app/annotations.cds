using OrgService as service from '../srv/org-service';

// tag::labels[]
annotate service.Objects with {
  ObjectType @title : 'Object Type';
  ObjectId   @title : 'Object ID';
  Name       @title : 'Name';
};
annotate service.Relationships with {
  Relationship @title : 'Relationship';
  TargetType   @title : 'Related Type';
  TargetId     @title : 'Related Object';
};
annotate service.RelationshipTypes with {
  Meaning @title : 'Meaning';
};
// end::labels[]

// tag::restrict[]
// The model only adds objects and relationships: no Delete and no Edit, and the
// service answers HTTP 405 to a DELETE or PATCH.
annotate service.Objects with @Capabilities : {
  DeleteRestrictions : { Deletable : false },
  UpdateRestrictions : { Updatable : false } };
annotate service.Relationships with @Capabilities : {
  DeleteRestrictions : { Deletable : false },
  UpdateRestrictions : { Updatable : false } };
// end::restrict[]

// tag::browse[]
annotate service.Objects with @(
  UI.LineItem : [{ Value : ObjectType }, { Value : ObjectId }, { Value : Name }],
  UI.HeaderInfo : { TypeName : 'Object', TypeNamePlural : 'Objects', Title : { Value : Name } },
  UI.Facets : [
    { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' },
    { $Type : 'UI.ReferenceFacet', Label : 'Relationships', Target : 'Relationships/@UI.LineItem' }
  ],
  UI.FieldGroup #General : { Data : [{ Value : ObjectType }, { Value : ObjectId }, { Value : Name }] }
);
annotate service.Relationships with @(
  UI.LineItem : [
    { Value : Relationship },
    { Value : Kind.Meaning },
    { Value : TargetType },
    { Value : TargetId },
    { Value : Target.Name, Label : 'Related Name' }
  ]
);
// end::browse[]
