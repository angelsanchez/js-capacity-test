iris.screen(function(self) {

	var todos = iris.resource(iris.path.resource);

	self.create = function() {
		self.tmpl(iris.path.welcome.html);

		self.get("new-todo").on("keyup", function (e) {
			if ( e.keyCode === 13 && this.value.trim() !== "" ) {
				todos.add(this.value);
				this.value = "";
			}
		});

		self.get("toggle-all").on("change", function (e) {
			var completed = self.get("toggle-all").prop("checked");
			todos.setAll( completed );
		});

		self.get("text-filter").on("keyup", function (e) {
			var $textFilter = self.get("text-filter");
			console.log("TODO Filter by text = " + $textFilter.val());
		});

		self.get("clear-completed").on("click", todos.removeCompleted);

		self.get("show-only-important").on("change", function (e) {
			console.log('TODO show only todos with text "important". The URL should change like filter does in self.awake function')
		});

		// Resource events
		self.on(todos.CREATE_TODO, function (id) {
			self.ui("todo-list", iris.path.todo.js, {id: id}).render().show();
			render();
		});

		self.on(todos.DESTROY_TODO, function (id) {
			render();
		});

		self.on(todos.CHANGE_TODO, function (id) {
			render();
		});

		todos.init();
		render();
	};

	self.awake = function () {
		var filter = self.param("filter");
		if ( filter ) {
			todos.setFilter(filter);

			var $footer = self.get("footer");
			$(".selected", $footer).removeClass("selected");
			$("a[href='#?filter=" + filter + "']", $footer).addClass("selected");

			var todoList = self.ui("todo-list");
			if ( todoList ) {
				for (var i = 0; i < todoList.length; i++ ) {
					todoList[i].render();
				}
			}
		}
	};

	function render () {
		self.inflate({
			completed: "Clear completed (" + todos.completedCount() + ")",
			count: todos.importantCount() + " important / " + todos.remainingCount() + " item" + (todos.remainingCount() !== 1 ? "s " : " ") + "left",
			hasTodos: (todos.count() !== 0),
			hasRemainings: (todos.completedCount() > 0),
			noRemainingTodos: (todos.remainingCount() === 0)
		});
	}

}, iris.path.welcome.js);
