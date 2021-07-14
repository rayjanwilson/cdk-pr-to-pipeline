#!/usr/bin/env npx ts-node
import { execSync, exec } from 'child_process';

const destroy = async (stack: string): Promise<string> => {
  return new Promise(resolve => {
    console.log(`i am destroying ${stack}`);
    exec(`npx cdk destroy ${stack} --force`, (error, stdout, stderr) => {
      // 'npx cdk list'
      console.log(`destroyed ${stack}`);
      resolve(stdout);
    });
  });
};

const launch_all_destroys = async (stack_array: string[]) => {
  const promises = stack_array.map((stack: string) => destroy(stack));
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const outBuffer = execSync('npx cdk list', { encoding: 'utf8' });
const out = outBuffer.toString();

const stack_array = out.split('\n').filter(item => item !== '');
console.log(stack_array);

void launch_all_destroys(stack_array);
