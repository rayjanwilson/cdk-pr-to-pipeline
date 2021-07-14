"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pr2Pipeline = void 0;
const core_1 = require("@aws-cdk/core");
const codebuild = require("@aws-cdk/aws-codebuild");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class Pr2Pipeline extends core_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const gitHubSource = codebuild.Source.gitHub({
            owner: props.github.owner,
            repo: props.github.repo,
            cloneDepth: 1,
            webhook: true,
            webhookFilters: [
                codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_CREATED, codebuild.EventAction.PULL_REQUEST_REOPENED, codebuild.EventAction.PULL_REQUEST_MERGED),
            ],
        });
        const pr_trigger_project = new codebuild.Project(this, 'Project', {
            source: gitHubSource,
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: 0.2,
                phases: {
                    install: {
                        'on-failure': 'ABORT',
                        'runtime-versions': {
                            nodejs: 14,
                        },
                        commands: ['npm install'],
                    },
                    build: {
                        'on-failure': 'ABORT',
                        commands: [
                            '[ $CODEBUILD_WEBHOOK_EVENT = "PULL_REQUEST_MERGED" ] && npx ts-node ./cicd-pipeline/destroy-stacks.ts || npm run deploy',
                        ],
                    },
                },
            }),
        });
        const statement1 = new aws_iam_1.PolicyStatement();
        statement1.addActions('cloudformation:*');
        statement1.addResources('*');
        const statement2 = new aws_iam_1.PolicyStatement();
        statement2.addActions('ssm:*');
        statement2.addResources('*');
        const statement3 = new aws_iam_1.PolicyStatement();
        statement3.addActions('s3:*');
        statement3.addResources('*');
        const statement4 = new aws_iam_1.PolicyStatement();
        statement4.addActions('kms:*');
        statement4.addResources('*');
        const statement5 = new aws_iam_1.PolicyStatement();
        statement5.addActions('iam:PassRole');
        statement5.addResources('*');
        pr_trigger_project.addToRolePolicy(statement1);
        pr_trigger_project.addToRolePolicy(statement2);
        pr_trigger_project.addToRolePolicy(statement3);
        pr_trigger_project.addToRolePolicy(statement4);
        pr_trigger_project.addToRolePolicy(statement5);
    }
}
exports.Pr2Pipeline = Pr2Pipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBMEM7QUFDMUMsb0RBQW9EO0FBQ3BELDhDQUFtRDtBQVNuRCxNQUFhLFdBQVksU0FBUSxnQkFBUztJQUN4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQVk7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUMzQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdkIsVUFBVSxFQUFFLENBQUM7WUFDYixPQUFPLEVBQUUsSUFBSTtZQUNiLGNBQWMsRUFBRTtnQkFDZCxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDN0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFDMUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFDM0MsU0FBUyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FDMUM7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDaEUsTUFBTSxFQUFFLFlBQVk7WUFDcEIsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLFlBQVk7YUFDbkQ7WUFDRCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE9BQU8sRUFBRSxHQUFHO2dCQUNaLE1BQU0sRUFBRTtvQkFDTixPQUFPLEVBQUU7d0JBQ1AsWUFBWSxFQUFFLE9BQU87d0JBQ3JCLGtCQUFrQixFQUFFOzRCQUNsQixNQUFNLEVBQUUsRUFBRTt5QkFDWDt3QkFDRCxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUM7cUJBQzFCO29CQUNELEtBQUssRUFBRTt3QkFDTCxZQUFZLEVBQUUsT0FBTzt3QkFDckIsUUFBUSxFQUFFOzRCQUNSLHlIQUF5SDt5QkFDMUg7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDekMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsTUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDekMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUN6QyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsTUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDekMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0Msa0JBQWtCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGO0FBaEVELGtDQWdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcHMge1xuICBnaXRodWI6IHtcbiAgICBvd25lcjogc3RyaW5nO1xuICAgIHJlcG86IHN0cmluZztcbiAgICBicmFuY2g6IHN0cmluZztcbiAgfTtcbn1cbmV4cG9ydCBjbGFzcyBQcjJQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBnaXRIdWJTb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICBvd25lcjogcHJvcHMuZ2l0aHViLm93bmVyLFxuICAgICAgcmVwbzogcHJvcHMuZ2l0aHViLnJlcG8sXG4gICAgICBjbG9uZURlcHRoOiAxLFxuICAgICAgd2ViaG9vazogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQ6IHRydWUgaWYgYHdlYmhvb2tGaWx0ZXJzYCB3ZXJlIHByb3ZpZGVkLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXG4gICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoXG4gICAgICAgICAgY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVTExfUkVRVUVTVF9DUkVBVEVELFxuICAgICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfUkVPUEVORUQsXG4gICAgICAgICAgY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVTExfUkVRVUVTVF9NRVJHRURcbiAgICAgICAgKSxcbiAgICAgIF0sIC8vIG9wdGlvbmFsLCBieSBkZWZhdWx0IGFsbCBwdXNoZXMgYW5kIFB1bGwgUmVxdWVzdHMgd2lsbCB0cmlnZ2VyIGEgYnVpbGRcbiAgICB9KTtcblxuICAgIGNvbnN0IHByX3RyaWdnZXJfcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogZ2l0SHViU291cmNlLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF81XzAsXG4gICAgICB9LFxuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAwLjIsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICAgICdvbi1mYWlsdXJlJzogJ0FCT1JUJyxcbiAgICAgICAgICAgICdydW50aW1lLXZlcnNpb25zJzoge1xuICAgICAgICAgICAgICBub2RlanM6IDE0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbJ25wbSBpbnN0YWxsJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgJ29uLWZhaWx1cmUnOiAnQUJPUlQnLFxuICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgJ1sgJENPREVCVUlMRF9XRUJIT09LX0VWRU5UID0gXCJQVUxMX1JFUVVFU1RfTUVSR0VEXCIgXSAmJiBucHggdHMtbm9kZSAuL2NpY2QtcGlwZWxpbmUvZGVzdHJveS1zdGFja3MudHMgfHwgbnBtIHJ1biBkZXBsb3knLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnQxID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudDEuYWRkQWN0aW9ucygnY2xvdWRmb3JtYXRpb246KicpO1xuICAgIHN0YXRlbWVudDEuYWRkUmVzb3VyY2VzKCcqJyk7XG4gICAgY29uc3Qgc3RhdGVtZW50MiA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzdGF0ZW1lbnQyLmFkZEFjdGlvbnMoJ3NzbToqJyk7XG4gICAgc3RhdGVtZW50Mi5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBjb25zdCBzdGF0ZW1lbnQzID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudDMuYWRkQWN0aW9ucygnczM6KicpO1xuICAgIHN0YXRlbWVudDMuYWRkUmVzb3VyY2VzKCcqJyk7XG4gICAgY29uc3Qgc3RhdGVtZW50NCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzdGF0ZW1lbnQ0LmFkZEFjdGlvbnMoJ2ttczoqJyk7XG4gICAgc3RhdGVtZW50NC5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBjb25zdCBzdGF0ZW1lbnQ1ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudDUuYWRkQWN0aW9ucygnaWFtOlBhc3NSb2xlJyk7XG4gICAgc3RhdGVtZW50NS5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBwcl90cmlnZ2VyX3Byb2plY3QuYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudDEpO1xuICAgIHByX3RyaWdnZXJfcHJvamVjdC5hZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50Mik7XG4gICAgcHJfdHJpZ2dlcl9wcm9qZWN0LmFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQzKTtcbiAgICBwcl90cmlnZ2VyX3Byb2plY3QuYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudDQpO1xuICAgIHByX3RyaWdnZXJfcHJvamVjdC5hZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50NSk7XG4gIH1cbn1cbiJdfQ==