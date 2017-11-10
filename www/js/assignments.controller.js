
(function() {
    'use strict';

    angular
        .module('app')
        .controller('AssignmentsCtrl', AssignmentsCtrl)

    AssignmentsCtrl.$inject = ['$scope', '$ionicModal', '$timeout', 'Projects', '$ionicSideMenuDelegate'];

    function AssignmentsCtrl($scope, $ionicModal, $timeout, Projects, $ionicSideMenuDelegate) {
        var vm = this;

        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function(projectTitle) {
            var newProject = Projects.newProject(projectTitle);
            vm.projects.push(newProject);
            Projects.save(vm.projects);
            vm.selectProject(newProject, vm.projects.length-1);
        }

        vm.projects = Projects.all();
        vm.activeProject = vm.projects[Projects.getLastActiveIndex()];
        vm.tasks = [];

        vm.createTask = createTask;
        vm.newTask = newTask;
        vm.closeNewTask = closeNewTask;
        vm.newProject = newProject;
        vm.selectProject = selectProject;
        vm.toggleProjects = toggleProjects;

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            vm.taskModal = modal;
            }, {
            scope: $scope,
        });

        // Called when the form is submitted
        function createTask(task) {
            if(!vm.activeProject || !task) {
                return;
            }

            vm.activeProject.tasks.push({
                title: task.title
            });
            vm.taskModal.hide();

            Projects.save(vm.projects);

            task.title = "";
        };

        function newProject() {
            var projectTitle = prompt('Project Name');
            if(projectTitle) {
                createProject(projectTitle);
            }
        }
        // Open our new task modal
        function newTask() {
            vm.taskModal.show();
        };

        // Close the new task modal
        function closeNewTask() {
            vm.taskModal.hide();
        };

        function selectProject(project, index) {
            vm.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        function toggleProjects() {
            $ionicSideMenuDelegate.toggleLeft();
        };


    }

})();