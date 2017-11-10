(function() {
    'use strict';

    angular
        .module('app')
        .controller('AssignmentsCtrl', AssignmentsCtrl)

    AssignmentsCtrl.$inject = ['$scope', '$ionicModal', '$timeout', 'Projects', '$ionicSideMenuDelegate'];

    function AssignmentsCtrl($scope, $ionicModal, $timeout, Projects, $ionicSideMenuDelegate) {
        //Setup view model
        var vm = this;

        //Important variables
        vm.activeProject = vm.projects[Projects.getLastActiveIndex()];
        vm.noClassMessage = "Please select a Class";
        vm.projects = Projects.all();
        vm.tasks = [];

        //Functions
        vm.closeNewTask = closeNewTask;
        vm.createTask = createTask;
        vm.newProject = newProject;
        vm.newTask = newTask;
        vm.selectProject = selectProject;
        vm.toggleProjects = toggleProjects;
        vm.updateProjects = updateProjects;

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            vm.taskModal = modal;
            }, {
            scope: $scope,
        });

        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function(projectTitle) {
            var newProject = Projects.newProject(projectTitle);
            vm.projects.push(newProject);
            Projects.save(vm.projects);
            vm.selectProject(newProject, vm.projects.length-1);
        }

        // Close the new task modal
        function closeNewTask() {
            vm.taskModal.hide();
        };
        
        // Called when the form is submitted
        function createTask(task) {
            if(!vm.activeProject || !task) {
                return;
            }

            vm.activeProject.tasks.push({
                title: task.title,
                due: task.due,
                description: task.description,
                complete: false
            });
            vm.taskModal.hide();

            Projects.save(vm.projects);

            task.title = "";
            task.due = "";
            task.description = "";
            task.complete = false;
        };

        function newProject() {
            var projectTitle = prompt('Class Name');
            if(projectTitle) {
                createProject(projectTitle);
            }
        }
        // Open our new task modal
        function newTask() {
            vm.taskModal.show();
        };

        function selectProject(project, index) {
            vm.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        function toggleProjects() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        function updateProjects() {
            Projects.save(vm.projects);
        };
    }

})();