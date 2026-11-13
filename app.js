/* Treehouse FSJS Techdegree
 * Static Node.js and Express Site - Portfolio
 * app.js */

const express = require('express');
const path = require('path');
const data = require('./data.json');

const app = express();
const { projects } = data;

// Port 3000 locally; hosting services like Render provide their own port
const PORT = process.env.PORT || 3000;

/* Middleware */

// render the Pug templates in the views folder
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serve the css, js and images in the public folder from the /static route
app.use('/static', express.static(path.join(__dirname, 'public')));

/* Routes */

// home page: shows a thumbnail for every project
app.get('/', (req, res) => {
  res.render('index', { projects });
});

// about page
app.get('/about', (req, res) => {
  res.render('about');
});

// project pages: shows the project whose id matches the id in the url
app.get('/project/:id', (req, res, next) => {
  const project = projects.find(({ id }) => String(id) === req.params.id);

  if (project) {
    res.render('project', { project });
  } else {
    // no project with that id, so let the 404 handler below deal with it
    next();
  }
});

/* Error handling */

// 404 handler: catches any request that did not match a route above
app.use((req, res, next) => {
  const err = new Error("Sorry, an error has occured.");
  err.status = 404;
  console.log(`Error ${err.status}: ${err.message}`);
  next(err);
});

// global error handler: deals with the 404 error above and any server errors
app.use((err, req, res, next) => {
  // if the response has already started, hand the error to Express's default handler
  if (res.headersSent) {
    return next(err);
  }

  err.status = err.status || 500;
  err.message = err.message || 'Something went wrong on our end.';
  console.log(`Error ${err.status}: ${err.message}`);

  // never show internal error details to visitors
  const message = err.status === 404
    ? err.message
    : 'Something went wrong on our end. Please try again later.';

  res.status(err.status);
  res.render('error', { status: err.status, message });
});

/* Start the server */

app.listen(PORT, () => {
  console.log(`The application is running on localhost:${PORT}`);
});
