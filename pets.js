// populates the unordered list with pets
var addAllPets = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/pets');
  xhr.addEventListener('load', function() {
    var pets = JSON.parse(xhr.responseText);
    pets.forEach(function(pet) {
      addPet(pet);
    });
  });

  xhr.send();
};

addAllPets();

// deletes a pet using the API
var deletePet = function() {
  var li = this.parentNode;
  var id = li.id.substring(3); //pet1 <<takes everything after character 3 (t)
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'http://localhost:3000/pet/' + id);
  xhr.addEventListener('load', function() {
    if (JSON.parse(xhr.responseText)['deleted'] === true) {
      li.remove();
    }
  });

  xhr.send();
}

// adds pets to the unordered list
var addPet = function(pet) {
  var li = document.createElement('li');
  setLiToPet(li, pet);
  var ul = document.getElementById('petsList');
  ul.appendChild(li);
};

// adds id, name, and type to each li
var setLiToPet = function(li, pet) {
  li.setAttribute('id', 'pet' + pet.id);
  li.innerHTML = "";

  //pet details
  var petText = pet.name + " is a " + pet.type;
  var petTextNode = document.createTextNode(petText); //creates text elements
  li.appendChild(petTextNode);

  //edit pet
  var edit = document.createElement('button');
  edit.innerHTML = "Edit";
  edit.addEventListener('click', function() {
    editPet(li, pet.name, pet.type);
  });
  li.appendChild(edit);

  //delete pet
  var deleteButton = document.createElement('button');
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener('click', deletePet);
  li.appendChild(deleteButton);
};

// adds the edited fields for a pet
var editPet = function(li, name, type) {
  li.innerHTML = "";
  var id = li.id.substring(3);
  // pet name input text field
  var nameField = document.createElement('input');
  nameField.setAttribute('type', 'text');
  nameField.setAttribute('id', 'name');

  nameField.value = name;
  li.appendChild(nameField);

  // filler text
  var isA = document.createTextNode(' is a ');
  li.appendChild(isA);

  // pet type input field
  var typeField = document.createElement('input');
  typeField.setAttribute('type', 'text');
  typeField.setAttribute('id', 'type');
  typeField.value = type;
  li.appendChild(typeField);

  // add update button
  var updateButton = document.createElement('button');
  updateButton.innerHTML = "Update";
  updateButton.addEventListener('click', function() {
    var newNameUpcase = nameField.value.substring(0,1).toUpperCase() + nameField.value.substring(1);
    var newName = newNameUpcase;
    var newType = typeField.value.toLowerCase();
    updatePet(li, newName, newType);
  });
  li.appendChild(updateButton);

  // add event listener on name field
  var name = document.getElementById("name");
  name.addEventListener("keydown", function(evt) {
    if (evt.keyCode === 13) {
      var newNameUpcase = nameField.value.substring(0,1).toUpperCase() + nameField.value.substring(1);
      var newName = newNameUpcase;
      var newType = typeField.value.toLowerCase();
      updatePet(li, newName, newType);
    }
  })

  // add event listener on type field
  var type = document.getElementById("type");
  type.addEventListener("keydown", function(evt) {
    if (evt.keyCode === 13) {
      var newNameUpcase = nameField.value.substring(0,1).toUpperCase() + nameField.value.substring(1);
      var newName = newNameUpcase;
      var newType = typeField.value.toLowerCase();
      updatePet(li, newName, newType);
    }
  })

}

// update a pet using the API
var updatePet = function(li, newName, newType) {
  var id = li.id.substring(3);
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', 'http://localhost:3000/pet/' + id);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.addEventListener('load', function() {
    var returnedPet = JSON.parse(xhr.responseText);
    setLiToPet(li, returnedPet);
  });

  var updatedPet = { name: newName, type: newType};
  xhr.send(JSON.stringify(updatedPet));
};

var addNewPetButton = document.getElementById('addNewPet');
addNewPetButton.addEventListener('click', function() {
  var newName = document.getElementById('newPetName');
  var newType = document.getElementById('newPetType');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/pet');
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.addEventListener('load', function() {
    var returnedPet = JSON.parse(xhr.responseText);
    addPet(returnedPet);
    newName.value = '';
    newType.value = '';
  });

  var newNameUpcase = newName.value.substring(0,1).toUpperCase() + newName.value.substring(1);
  var newPet = { name: newNameUpcase, type: (newType.value).toLowerCase() };
  xhr.send(JSON.stringify(newPet));
});

var input = document.getElementById('newPetType');
input.addEventListener('keydown', function(evt) {
  if (evt.keyCode === 13) {
    addNewPetButton.click();
  }
});
