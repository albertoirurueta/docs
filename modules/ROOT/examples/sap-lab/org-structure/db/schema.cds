namespace sap.guide.org;

// A teaching model of the organizational structure of SAP HR, not SAP S/4HANA
// and not SAP SuccessFactors. Names, numbers and codes are invented example
// values. The model leaves out validity periods and the deletion of objects.

// An object has a type (O unit, S position, C job, P person) and an ID.
entity Objects {
  key ObjectType : String(1);
  key ObjectId   : String(8);
  Name           : String(40);
  Relationships  : Association to many Relationships
                     on Relationships.SourceType = $self.ObjectType
                    and Relationships.SourceId = $self.ObjectId;
}

// The kinds of relationship: a letter for the direction, a subtype number, the
// object types at both ends and the relationship that is the same link read
// from the other end.
entity RelationshipTypes {
  key Relationship : String(4);
  Meaning          : String(40);
  SourceType       : String(1);
  TargetType       : String(1);
  Inverse          : String(4);
}

// A relationship is stored twice, once from each end.
entity Relationships {
  key Relationship : String(4);
  key SourceType   : String(1);
  key SourceId     : String(8);
  key TargetType   : String(1);
  key TargetId     : String(8);
  Kind             : Association to RelationshipTypes
                       on Kind.Relationship = $self.Relationship;
  Target           : Association to Objects
                       on Target.ObjectType = $self.TargetType
                      and Target.ObjectId = $self.TargetId;
}

// An evaluation path is a short table: from objects of one type, follow one
// relationship to objects of another type, row by row.
entity EvaluationPaths {
  key Path    : String(10);
  Description : String(60);
  Steps       : Composition of many EvaluationSteps
                  on Steps.Path = $self;
}

entity EvaluationSteps {
  key Path     : Association to EvaluationPaths;
  key Row      : Integer;
  FromType     : String(1);
  Relationship : String(4);
  ToType       : String(1);
}
