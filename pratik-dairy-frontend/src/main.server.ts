import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { consumerAfterComputation } from '@angular/core/primitives/signals';

//Hello I am kartik 

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;