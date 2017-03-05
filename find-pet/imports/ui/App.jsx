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

  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }

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

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    // ya no las leera localmente sino que las obtiene del servidor
    //return this.getTasks().map((task) => (

    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter( task => !task.checked );
    }

    //return this.props.tasks.map((task) => (
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Lista de Tareas Perdidas ({this.props.incompleteCount})  </h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

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
  incompleteCount: PropTypes.number.isRequired,
};

// en bolas tambien - our data container ?
export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: {createdAt: -1} }).fetch(),
    incompleteCount: Tasks.find( {checked: {$ne: true} } ).count(),
  };
}, App);


