const checkStatus = (response) => {
    if (response.ok) {
      return response;
    }
    throw new Error('Request was either a 404 or 500');
  }
  
  const json = (response) => response.json()
  
  class Task extends React.Component {
    render () {
      const { task, onDelete, onComplete } = this.props;
      const { id, content, completed } = task;
      return (
        <div className="row mb-1 d-flex">
          <div className = "col d-flex justify-content-end mr-4">
            <input
            className="d-inline-block mt-2"
            type="checkbox"
            onChange={() => onComplete(id, completed)}
            checked={completed}
            />
          </div>
          <div className = "col">
            <p>{content}</p>
          </div>
          <div className = "col">
            <button className = "btn btn-sm btn-danger mr-4 p-2"
                onClick={() => onDelete(id)}
              >Delete</button>
          </div>
 
        </div>
      )
    }
  }
  
  class ToDoList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        new_task: '',
        tasks: [],
        filter: 'all'
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fetchTasks = this.fetchTasks.bind(this);
      this.deleteTask = this.deleteTask.bind(this);
      this.toggleComplete = this.toggleComplete.bind(this);
      this.toggleFilter = this.toggleFilter.bind(this);
    }
  
    componentDidMount() {
      this.fetchTasks();
    }
  
    fetchTasks() {
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=107")
        .then(checkStatus)
        .then(json)
        .then((response) => {
          console.log(response);
          this.setState({tasks: response.tasks});
        })
        .catch(error => {
          console.error(error.message);
        })
    }
  
    handleChange(event) {
      this.setState({ new_task: event.target.value });
    }
  
    handleSubmit(event) {
      event.preventDefault();
      let { new_task } = this.state;
      new_task = new_task.trim();
      if (!new_task) {
        return;
      }
  
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=107", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: {
            content: new_task
          }
        }),
      }).then(checkStatus)
        .then(json)
        .then((data) => {
          this.setState({new_task: ''});
          this.fetchTasks();
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        })
    }
  
    deleteTask(id) {
      if (!id) {
        return;
      }
      fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=107`, {
        method: "DELETE",
        mode: "cors",
      }).then(checkStatus)
        .then(json)
        .then((data) => {
          this.fetchTasks();
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        })
    }
  
    toggleComplete(id, completed) {
      if (!id) {
        return;
      }
      const newState = completed ? 'active' : 'complete';
  
      fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_${newState}?api_key=107`, {
        method: "PUT",
        mode: "cors",
      }).then(checkStatus)
        .then(json)
        .then((data) => {
          this.fetchTasks();
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        })
    }
  
    toggleFilter(e) {
      console.log(e.target.name)
      this.setState({
        filter: e.target.name
      })
    }
  
    render() {
      const { new_task, tasks, filter } = this.state;
  
      return (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center mt-4 mb-2">To Do List</h2>
              <div className = "row d-flex justify-content-center">
                <form onSubmit={this.handleSubmit} className="form-row mb-4 col-8 justify-content-center parentInput" >
                  <input
                    type="text"
                    className="form-control col-7 mb-2 input"
                    placeholder="new task"
                    value={new_task}
                    onChange={this.handleChange}
                  />
                  <span className = "text-center col-2">
                      <button type="submit" className="btn btn-primary ml-5 mb-2 ">Submit</button>
                  </span>
                </form>
              </div>
              {tasks.length > 0 ? tasks.filter(task => {
                if (filter === 'all') {
                  return true;
                } else if (filter === 'active') {
                  return !task.completed;
                } else {
                  return task.completed;
                }
              }).map((task) => {
                return (
                  <Task
                    key={task.id}
                    task={task}
                    onDelete={this.deleteTask}
                    onComplete={this.toggleComplete}
                  />
                );
              }) : <p>no tasks here</p>}
              <div className="mt-3 d-flex justify-content-center">
                <label className = "mr-2">
                  <input type="checkbox" name="all" checked={filter === "all"} onChange={this.toggleFilter} /> All
                </label>
                
                <label className = "mr-2">
                  <input type="checkbox" name="active" checked={filter === "active"} onChange={this.toggleFilter} /> Active 
                </label>
                <label className = "mr-2">
                  <input type="checkbox" name="completed" checked={filter === "completed"} onChange={this.toggleFilter} /> Completed 
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
  
  ReactDOM.render(
    <ToDoList />,
    document.getElementById('root')
  );  

