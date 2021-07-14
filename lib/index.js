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
            ], // optional, by default all pushes and Pull Requests will trigger a build
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
                            `[ $CODEBUILD_WEBHOOK_EVENT = "PULL_REQUEST_MERGED" ] && npx ts-node ${__dirname}/./destroy-stacks.ts || npm run deploy`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBMEM7QUFDMUMsb0RBQW9EO0FBQ3BELDhDQUFtRDtBQVNuRCxNQUFhLFdBQVksU0FBUSxnQkFBUztJQUN4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQVk7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUMzQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdkIsVUFBVSxFQUFFLENBQUM7WUFDYixPQUFPLEVBQUUsSUFBSTtZQUNiLGNBQWMsRUFBRTtnQkFDZCxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDN0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFDMUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFDM0MsU0FBUyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FDMUM7YUFDRixFQUFFLHlFQUF5RTtTQUM3RSxDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ2hFLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZO2FBQ25EO1lBQ0QsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxPQUFPLEVBQUUsR0FBRztnQkFDWixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFO3dCQUNQLFlBQVksRUFBRSxPQUFPO3dCQUNyQixrQkFBa0IsRUFBRTs0QkFDbEIsTUFBTSxFQUFFLEVBQUU7eUJBQ1g7d0JBQ0QsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO3FCQUMxQjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsWUFBWSxFQUFFLE9BQU87d0JBQ3JCLFFBQVEsRUFBRTs0QkFDUix1RUFBdUUsU0FBUyx3Q0FBd0M7eUJBQ3pIO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMxQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUN6QyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsTUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDekMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEMsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixrQkFBa0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0Msa0JBQWtCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0Msa0JBQWtCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRjtBQWhFRCxrQ0FnRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BzIHtcbiAgZ2l0aHViOiB7XG4gICAgb3duZXI6IHN0cmluZztcbiAgICByZXBvOiBzdHJpbmc7XG4gICAgYnJhbmNoOiBzdHJpbmc7XG4gIH07XG59XG5leHBvcnQgY2xhc3MgUHIyUGlwZWxpbmUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZ2l0SHViU291cmNlID0gY29kZWJ1aWxkLlNvdXJjZS5naXRIdWIoe1xuICAgICAgb3duZXI6IHByb3BzLmdpdGh1Yi5vd25lcixcbiAgICAgIHJlcG86IHByb3BzLmdpdGh1Yi5yZXBvLFxuICAgICAgY2xvbmVEZXB0aDogMSxcbiAgICAgIHdlYmhvb2s6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0OiB0cnVlIGlmIGB3ZWJob29rRmlsdGVyc2Agd2VyZSBwcm92aWRlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICB3ZWJob29rRmlsdGVyczogW1xuICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXAuaW5FdmVudE9mKFxuICAgICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfQ1JFQVRFRCxcbiAgICAgICAgICBjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX1JFT1BFTkVELFxuICAgICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfTUVSR0VEXG4gICAgICAgICksXG4gICAgICBdLCAvLyBvcHRpb25hbCwgYnkgZGVmYXVsdCBhbGwgcHVzaGVzIGFuZCBQdWxsIFJlcXVlc3RzIHdpbGwgdHJpZ2dlciBhIGJ1aWxkXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcl90cmlnZ2VyX3Byb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGdpdEh1YlNvdXJjZSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuU1RBTkRBUkRfNV8wLFxuICAgICAgfSxcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogMC4yLFxuICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICBpbnN0YWxsOiB7XG4gICAgICAgICAgICAnb24tZmFpbHVyZSc6ICdBQk9SVCcsXG4gICAgICAgICAgICAncnVudGltZS12ZXJzaW9ucyc6IHtcbiAgICAgICAgICAgICAgbm9kZWpzOiAxNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21tYW5kczogWyducG0gaW5zdGFsbCddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICdvbi1mYWlsdXJlJzogJ0FCT1JUJyxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIGBbICRDT0RFQlVJTERfV0VCSE9PS19FVkVOVCA9IFwiUFVMTF9SRVFVRVNUX01FUkdFRFwiIF0gJiYgbnB4IHRzLW5vZGUgJHtfX2Rpcm5hbWV9Ly4vZGVzdHJveS1zdGFja3MudHMgfHwgbnBtIHJ1biBkZXBsb3lgLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnQxID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudDEuYWRkQWN0aW9ucygnY2xvdWRmb3JtYXRpb246KicpO1xuICAgIHN0YXRlbWVudDEuYWRkUmVzb3VyY2VzKCcqJyk7XG4gICAgY29uc3Qgc3RhdGVtZW50MiA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzdGF0ZW1lbnQyLmFkZEFjdGlvbnMoJ3NzbToqJyk7XG4gICAgc3RhdGVtZW50Mi5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBjb25zdCBzdGF0ZW1lbnQzID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudDMuYWRkQWN0aW9ucygnczM6KicpO1xuICAgIHN0YXRlbWVudDMuYWRkUmVzb3VyY2VzKCcqJyk7XG4gICAgY29uc3Qgc3RhdGVtZW50NCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzdGF0ZW1lbnQ0LmFkZEFjdGlvbnMoJ2ttczoqJyk7XG4gICAgc3RhdGVtZW50NC5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBjb25zdCBzdGF0ZW1lbnQ1ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudDUuYWRkQWN0aW9ucygnaWFtOlBhc3NSb2xlJyk7XG4gICAgc3RhdGVtZW50NS5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBwcl90cmlnZ2VyX3Byb2plY3QuYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudDEpO1xuICAgIHByX3RyaWdnZXJfcHJvamVjdC5hZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50Mik7XG4gICAgcHJfdHJpZ2dlcl9wcm9qZWN0LmFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQzKTtcbiAgICBwcl90cmlnZ2VyX3Byb2plY3QuYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudDQpO1xuICAgIHByX3RyaWdnZXJfcHJvamVjdC5hZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50NSk7XG4gIH1cbn1cbiJdfQ==