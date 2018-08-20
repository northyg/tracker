
function newExercise() {
  //alert("Button was pressed");
  var req = new XMLHttpRequest();
  var name = document.getElementsByName('newName')[0].value;
  var reps = document.getElementsByName('newReps')[0].value;
  var weight = document.getElementsByName('newWeight')[0].value;
  var lbsCheckBox = document.getElementById('newLbs');
  var lbs = "";
  if (lbsCheckBox.checked) { 
    lbs ="1";
  }
  else { 
    lbs="0"; 
  }

  var date = document.getElementsByName('newDate')[0].value;

  if("" == name)
  {
    alert("Please enter a name");
    return false;
  }  
  else if("" == reps)
  {
    alert("Please enter reps");
    return false;
  }
  else if("" == weight)
  {
    alert("Please enter the weight");
    return false;
  }
  else if("" == date)
  {
    alert("Please enter the date");
    return false;
  }

  req.open("GET", "/insert?name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs, true);

  req.addEventListener("load", function(){
    //alert(req.responseText);
    var response = JSON.parse(req.responseText);
    //alert(response);
    var table = document.getElementById('exerciseTable');
    var row = document.createElement("tr"); //table.insertRow(-1); // insert new row at the last position
    row.setAttribute("id", response.id); // need to set ID to id
    var nameCell = document.createElement("td"); //row.insertCell(0);
    var repCell = document.createElement("td"); //row.insertCell(1);
    var weightCell = document.createElement("td"); //row.insertCell(2);
    var lbsCell = document.createElement("td"); //row.insertCell(3);
    var dateCell = document.createElement("td"); //row.insertCell(4);
    var editCell = document.createElement("td"); //row.insertCell(5);
    var deleteCell = document.createElement("td"); //row.insertCell(6);

    nameCell.textContent = response.name;
    repCell.textContent = response.reps;
    weightCell.textContent = response.weight;
    dateCell.textContent = response.date;
    if (1 == response.lbs) {
      lbsCell.textContent = "Lbs";
    }
    else {
      lbsCell.textContent = "Kg";
    }
    var editButton = document.createElement("input");
    editButton.type = "submit";
    editButton.value = "Edit";
    //var editFunction = editCell(response.id);
    //editButton.onclick = function() { editCell(response.id);};
    //editButton.setAttribute("onclick", "editCell("+response.id");");
    editButton.onclick = function () { 
      editCellFn(response.id);
    }; 
    editCell.appendChild(editButton);

    var deleteButton = document.createElement("input");
    deleteButton.type = "submit";
    deleteButton.value = "Delete";
    // deleteButton.onclick = "deleteCell(" + response.id + ");";
    deleteButton.onclick = function () {
      deleteCellFn(response.id);
    }
    deleteCell.appendChild(deleteButton);


    row.append(nameCell);
    row.append(repCell);
    row.append(weightCell);
    row.append(lbsCell);
    row.append(dateCell);
    row.append(editCell);
    row.append(deleteCell);
    table.append(row);
  });

  req.send(null);
  event.preventDefault();
}


var deleteCell = function deleteCell(idIndex) {
  //alert("Requesting delete ID " + idIndex);
  //do delete stuff
  var req = new XMLHttpRequest();
  req.open("GET", "/delete?id=" + idIndex, true);

  req.addEventListener("load", function(){
    //var response = JSON.parse(req.responseText);
    
    // delete the row in the table here
    var table = document.getElementById('exerciseTable');
    var rows = table.rows;
    //alert(rows[2].id);
    
    for (var i = 1; i < rows.length; ++i) {
      if (rows[i].id == idIndex) {
        //alert("Found the row to delete");
        table.deleteRow(i);
      }
    }
    

  });

  req.send(null);
  
}

var deleteCellFn = function(idIndex) {
  deleteCell(idIndex);
}


var editCell = function editCell(idIndex) {
  //alert("Requesting EDIT ID " + idIndex);
  var table = document.getElementById('exerciseTable');
  var rows = table.rows;
  var rowToEdit = 0;
    
  for (var i = 1; i < rows.length; ++i) {
    if (rows[i].id == idIndex) {
      //table.deleteRow(i);
      rowToEdit = i;
    }
  }

  var editRow = rows[rowToEdit].cells;
  var name = editRow[0].innerHTML;
  var reps = editRow[1].innerHTML;
  var weight = editRow[2].innerHTML;
  var units = editRow[3].textContent;
  var date = editRow[4].innerHTML;

  // strip leading and trailing whitespace
  units = units.replace(/(^\s+|\s+$)/g,''); 

  //alert(units);
  var lbsCell = document.createElement("td");
  lbsCell.textContent = "Lbs";
  //alert("Units are '"+units+"' and comparison is '"+lbsCell.textContent+"'")

  editRow[0].innerHTML = '<input type="text" value="'+name+'" id="editName'+idIndex+'">';
  editRow[1].innerHTML = '<input type="text" value="'+reps+'" id="editReps'+idIndex+'">';
  editRow[2].innerHTML = '<input type="text" value="'+weight+'" id="editWeight'+idIndex+'">';
  if ("Lbs" == units) {
    //alert("Checkbox should be checked...");
    editRow[3].innerHTML = 'Lbs<input type="checkbox" id="editLbs'+idIndex+'" checked>';
  }
  else {
    editRow[3].innerHTML = 'Lbs<input type="checkbox" id="editLbs'+idIndex+'">';
  }
  editRow[4].innerHTML = '<input type="text" value="'+date+'" id="editDate'+idIndex+'">';
  
  editRow[5].innerHTML = '<input type="submit" value="Save" onclick="saveCell('+idIndex+','+rowToEdit+');">';
}

var editCellFn = function(idIndex) {
  editCell(idIndex);
}

var saveCell = function saveCell(idIndex, rowIndex) {
  //alert("Trying to save " + idIndex + " in row " + rowIndex);

  //get the row to save data from
  //alert(editName.value);
  var row = document.getElementById('exerciseTable').rows[rowIndex].cells;
  var editName = document.getElementById('editName'+idIndex).value;
  //alert(editName);
  if (editName == "") {
    alert("You must enter a name to save");
    return false;
  }

  var editReps = document.getElementById('editReps'+idIndex).value;
  var editWeight = document.getElementById('editWeight'+idIndex).value;
  var editLbs = document.getElementById('editLbs'+idIndex);
  var lbs = "";
  if (editLbs.checked) { 
    lbs ="1";
  }
  else { 
    lbs="0"; 
  }
  var editDate = document.getElementById('editDate'+idIndex).value;

  var req = new XMLHttpRequest();
  req.open("GET", "/safe-update?id=" + idIndex + "&name=" + editName +
           "&reps=" + editReps + "&weight=" + editWeight + "&lbs=" + lbs + "&date=" + editDate, true);

  req.addEventListener("load", function(){
    var response = JSON.parse(req.responseText);
    
    // delete the row in the table here
    var table = document.getElementById('exerciseTable');
    var row = table.rows[rowIndex].cells;
    //alert("Edit should be complete");
    row[0].innerHTML = response.name;
    row[1].innerHTML = response.reps;
    row[2].innerHTML = response.weight;
    row[3].innerHTML = (1 == response.lbs) ? "Lbs" : "Kg";
    row[4].innerHTML = response.date;
    row[5].innerHTML = '<input type="submit" value="Edit" onclick="editCell(' + idIndex + ');">';

  });

  req.send(null);
  
}
