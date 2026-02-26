import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { consumerAfterComputation } from '@angular/core/primitives/signals';
<<<<<<< HEAD

//Hello I am kartik 

=======
//Add the comment in the file for git rebase command 
>>>>>>> 68bac87af93f442a696c6d214c89992f9b1e39b1
const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
