import * as aws from "@pulumi/aws";

class DynamoDB {
    table: aws.dynamodb.Table;
    constructor() {
        this.table = new aws.dynamodb.Table(
            "que-pelicula-ver-api",
            {
                attributes: [
                    { name: "PK", type: "S" },
                    { name: "SK", type: "S" }
                ],
                billingMode: "PAY_PER_REQUEST",
                hashKey: "PK",
                rangeKey: "SK",
                globalSecondaryIndexes: []
            },
            { protect: true }
        );
    }
}

export default DynamoDB;
