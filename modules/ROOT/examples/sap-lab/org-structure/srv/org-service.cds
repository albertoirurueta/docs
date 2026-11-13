using { sap.guide.org as db } from '../db/schema';
service OrgService {
  entity Objects            as projection on db.Objects;
  entity RelationshipTypes  as projection on db.RelationshipTypes;
  entity Relationships      as projection on db.Relationships;
  entity EvaluationPaths    as projection on db.EvaluationPaths;
  entity EvaluationSteps    as projection on db.EvaluationSteps;

  type Collected {
    Step       : Integer;
    ObjectType : String(1);
    ObjectId   : String(8);
    Name       : String(40);
  }
  type TreeNode {
    Level      : Integer;
    ObjectType : String(1);
    ObjectId   : String(8);
    Name       : String(40);
    Chief      : Boolean;
  }
  function evaluate(startType : String(1), startId : String(8), path : String(10))
    returns array of Collected;
  function tree(startId : String(8)) returns array of TreeNode;
}
