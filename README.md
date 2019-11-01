# JustGo
-----
### Train live location tracking and QR based ticketing system

This platform is based on three user roles

* **Passengers**
    >They can find trains using train schedule and ticket booking using justGo app and also passengers can get live location updates of trains.

* **Train Drivers**
    >This users can installe the app into their mobile and register with the platform then they can share live location update using justGo app.

* **Ticket Checkers**
    >This users can installe the app into their mobile and register with the platform then they can check the validity of the tickets for that they can scan the qr code and get the validfity.


# JustGo Laravel Backend

## Technologies 
----
[![N|Solid](https://camo.githubusercontent.com/5ceadc94fd40688144b193fd8ece2b805d79ca9b/68747470733a2f2f6c61726176656c2e636f6d2f6173736574732f696d672f636f6d706f6e656e74732f6c6f676f2d6c61726176656c2e737667)](https://laravel.com/) 


Laravel 5.5 , PHP -7.0.33 , MySQL 5.7.19, Composer
-----
----

# Steps

1.Clone the repository master branch to the server directory
```sh
$ git clone https://github.com/xcodemaker/justGo_server.git
```

2.Execute composer install in the cmd in the directory
```sh
$ composer install
```
3.Generate the env files 
```sh
$ cp .env.example .env
$ php artisan key:generate
```
4.Rename the database connection according to the your database credentials

5.Migrate the data base models using
```sh
$ php artisan migrate
```
5.Finally you can run the backend using 
```sh
$ php artisan serve
```

# JustGo Firebase Cloud Functions

## Technologies 
----
[![N|Solid](https://www.gstatic.com/devrel-devsite/v6bd5a0b4c9254732f5f201c272fcfb160f0efe389bcfbc2a4719d82eac4acb09/firebase/images/lockup.png)](https://firebase.google.com/) 


# Pre requisites

* NPM installed. More info here https://nodejs.org/en/
* Create a Firebase Project on https://console.firebase.google.com/. Follow the Firebase Documentation to create a new project on the Firebase console.
* Install Firebase CLI running ```npm install -g firebase-tools```.
More info here https://firebase.google.com/docs/cli/ 
If the command fails, you may need to change npm permissions as described here https://docs.npmjs.com/getting-started/fixing-npm-permissions or try to install Firebase CLI locally with ```npm install firebase-tools@```

You can find more info about Firebase Functions here https://firebase.google.com/docs/functions/get-started

# Setup
1.Clone or download this repo from github 
```sh
$ git clone https://github.com/xcodemaker/justGo_firebase.git
```
2.Run from command line:
```
$ cd functions 
$ npm install
```
3.Login to Firebase CLI with ```firebase login```. More info here  https://firebase.google.com/docs/cli/

4.Set up your Firebase project by running ```firebase use --add```, select your Project ID and follow the instructions.

# Deploy
* Deploy to Firebase using the following command: ```firebase deploy```. You can see the deployed functions on the Firebase Console under Functions menu.

# JustGo Android Application

## Technologies 
----
[![N|Solid](https://www.google.com/images/icons/product/android-64.png)](https://www.android.com/)   
[![N|Solid](https://www.gstatic.com/devrel-devsite/v6bd5a0b4c9254732f5f201c272fcfb160f0efe389bcfbc2a4719d82eac4acb09/firebase/images/lockup.png)](https://firebase.google.com/) 


# Pre requisites

* Android Studio installed.
* JDK setup in your system.

# Setup

1.Clone the Project from github 

```sh
$ git clone https://github.com/xcodemaker/justGo_android.git
```
2.Open the project using Android Studio 

3.Android app connect firebase using firebase assistant

4.Build the project 

5.Run the project using emulator or using Android Mobile phone
