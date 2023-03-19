# SSWU: JS_CAMP Homework 4 - Decbase Landing Page

This landing page was created as a homework assignment for the Sigma Software JS Camp. It is a responsive page that features smooth animations, data fetching, form validation, and more. The main goal of the project is to provide practice with web development tools and techniques while showcasing a realistic landing page that can be used in different contexts.

# Features

- Smooth scrolling navigation
- Section transitions with Intersection Observer API
- Dynamic data fetching with fetch API
- Form validation with regular expressions
- Modal window with custom animation

# Technologies used

- HTML
- CSS with SASS preprocessor
- JavaScript (native ES6+)

# How to use

You can access the landing page in two ways. The first option is to download the project and open the index.html file locally on your computer. The second option is to visit the GitHub Pages site for this project. Both options are straightforward and require no complex setup steps.

# Implementation details

Provided landing page project features HTML page structure with the use of SASS preprocessing for styling. All the animations were created from the scratch without using libraries. Such approach made life a bit harder and animations simplier, but the goal was to present creator's abbilities of using native tools in approaching the task of creating a complex landing page. Animation handling, data fetching, form validation and data parsing are presented exclusively with native JS ES6+ with the same reasoning.

Created landing page provides adaptive user experience for a huge variety of devices - from desktop to the smallest mobiles.

---

# Data fetching

The 'Services' section in this project utilizes data fetching from a Google Firebase no-code database using the native fetch API provided by the browser. On page load, all data is asynchronously loaded and sorted based on project type. The 'All' filter displays the first project of each type with a total of three projects shown.

For the form section, in addition to saving data to local storage, a POST request was implemented to send the data to the Firebase database.

> ## Note: <br>
>
> The current implementation does not provide any security for the stored data, as the API used cannot ensure its safety. The POST request implemented is solely for study and presentation purposes.

# Form section

Provided form has validation and data submission logic implemented using JavaScript. The form has three input fields for first name, last name, and email. When the form is submitted, the script checks the input values using regular expressions to ensure that the name fields contain only letters, and the email field is in a valid format. If the input values are invalid, an error message is displayed bellow the corresponding field. If all the input values are valid, the data is saved in local storage and sent to a remote Firebase database using a POST request.

There is also a conditional check where if the first name input value is "Alex", a modal window with greeting animation is opened. Greeting animation simulates confetti particles behavior. The animation consists of squares of different color, that with randomly generated properties fly out from the top of the screen to the bottom. It was created from the scratch using HTML for the container preset, CSS for styling and JavaScript for configuration.

# Credits

This project was created by Alex Bihas.

# License

This project is licensed under the MIT License.
