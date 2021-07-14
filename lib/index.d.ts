import { Construct } from '@aws-cdk/core';
export interface Props {
    github: {
        owner: string;
        repo: string;
        branch: string;
    };
}
export declare class Pr2Pipeline extends Construct {
    constructor(scope: Construct, id: string, props: Props);
}
