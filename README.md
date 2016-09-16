# Angular - Meteor Tutorial

Angular 1 with Meteor from: http://www.angular-meteor.com/tutorials/socially/angular1

### Bootstrapping

Windows: https://www.meteor.com/install 

```
$ meteor create socially
$ cd socially


$ meteor

=> Started proxy
=> Started MongoDB.
=> Started your app.

=> App running at: http://localhost:3000/


```

Meteor scans all the HTML files in your application and concatenates them together.

Concatenation means merging the content of all HTML, HEAD and BODY tags found inside these HTML files together.

So in our case, Meteor found our index.html file, found the BODY tag inside and added it's content to the BODY tag of the main generated file.


### Adding Angular 1

Because we decided to work with AngularJS in the client side, we need to remove the default UI package of Meteor, called Blaze.

We also need to remove Meteor's default ECMAScript2015 package named ecmascript because Angular-Meteor uses a package named angular-babel in order to get both ECMAScript2015 and AngularJS DI annotations.

So let's remove it by running:
```
$ meteor remove blaze-html-templates
$ meteor remove ecmascript

$ meteor npm install --save angular angular-meteor
$ meteor add angular-templates pbastowski:angular-babel

$ meteor npm install --save angular angular-meteor
$ meteor add angular-templates pbastowski:angular-babel

```

It's very important to note - the paths are always absolute, not relative! so if main.html was inside a root folder of your app, 
you would have to place the whole path from the route app, doesn't matter where you're calling the file from.

E.g. if main.html was in a root folder your include would look like:
<div ng-include="'main.html'"></div>

### 3-Way data binding

Every Meteor client includes an in-memory database cache. To manage the client cache, the server publishes sets of JSON documents,
 and the client subscribes to these sets. As documents in a set change, the server patches each client's cache automatically.

That introduce us to a new concept - Full Stack Reactivity. In an Angularish language we might call it 3 way data binding.

The way to handle data in Meteor is through the Mongo.Collection class. It is used to declare MongoDB collections and to manipulate them.

Thanks to minimongo, Meteor's client-side Mongo emulator, Mongo.Collection can be used from both client and server code.

### Binding to Angular 1

Now that we've created the collection, our client needs to subscribe to its changes and bind it to our parties array.
To bind them we are going to use the built-in angular-meteor feature called *helpers*.

