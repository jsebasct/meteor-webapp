import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data'

import {Tasks} from '../api/tasks.js'

import Task from './Task.jsx';

// App component - represents the whole app
class App extends Component {
  // getTasks() {
  //   return [
  //     { _id: 1, text: 'This is pet 1' },
  //     { _id: 2, text: 'This is pet 2' },
  //     { _id: 3, text: 'This is pet 3' },
  //   ];
  // }

  handleSubmit(event) {
    event.preventDefault();

    // find textfield
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createAt: new Date(),
    });

    // clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    // ya no las leera localmente sino que las obtiene del servidor
    //return this.getTasks().map((task) => (
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Lista de Mascotas Perdidas</h1>


          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type='text'
              ref='textInput'
              placeholder='Type to add new task'
            />
          </form>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

// okey no se escribe ningun codigo y server esta 'conectado' con client

// esta parte en bolas
App.propTypes  = {
  tasks: PropTypes.array.isRequired,
};

// en bolas tambien
export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: {createdAt: -1} }).fetch(),
  };
}, App);


