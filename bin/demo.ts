#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DemoStack } from "../lib/demo-stack";

const app = new cdk.App();
new DemoStack(app, "DemoStack");
