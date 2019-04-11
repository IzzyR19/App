//global variables
var filetext  = "";
var fileBinding;
var fileEntry;

var ractive;

//parameters catch information
//two types of listeners, web and device
//$(subject).on("command", execute function);

console.log("setting up events");



//setup event listeners
$(document).on("pagecreate","#pageone", onPageCreated);



 books = [
  { name: 'Da Vinci Code', 	author: 'Dan Brown',  describe: 'It is fun and confusing'	},
  { name: 'Shutter Island',  author: 'Dennis Lehane', describe: 'Good plot twist'	},
  { name: 'City of Bones',	author: 'Cassandra Clare', describe: 'Cool plot but wow is the series long'},
];

//setup listener for device API load
document.addEventListener("deviceready", onDeviceReady, false);

// once jQuery page 'pageone' has been created 
function onPageCreated() {
    
    //setup listern for change in image input element
	var input = document.querySelector('input[type=file]');
	input.onchange = function () {
  		var file = input.files[0];
		displayAsImage(file);  //call this fucntion with the file name if the image once taken.
	};
    
    //the add and delete buttons
    $('#writeFile').on('tap', function(e){
       addToList()
})
    
    $('deleteFile').on('tap', function(e){
        takeFromList()
    })
    
   
	
     ractive = new Ractive({
		  // The `el` option can be a node, an ID, or a CSS selector.
		  el: '#listcontent',
	
		  // We could pass in a string, but for the sake of convenience
		  // we're passing the ID of the <script> tag above.
	  template: '#template',
	
		  // Here, we're passing in some initial data
		  data: { booklist: books } 
        
    })
    
    }



//functions that make adding to and taking from possible
    function addToList(){     
        
        books.push(
        { name: $('textarea#titletext').val() , 	author: $('textarea#authortext').val() ,  describe: $('textarea#commenttext').val() }
            );
        
        console.log(books);
        
        ractive.update();

    }
    
    function takeFromList(){
        
       
        
    }
	
    
//everything onwards is how local storage is accessed
function onDeviceReady() {
	console.log("device ready");
	destinationType=navigator.camera.DestinationType;
    
    //following allows you to gain access to the supported platform specific locations that are shared by all applications (useful for stioring images, music etc. )
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotFS, fail);
    //syncedDataDirectory if you wanna sync to iCloud
}

//camera stuff
function capturePhoto() {
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
	destinationType: destinationType.DATA_URL });
}
	
function onPhotoDataSuccess(imageData) {
	var image = document.getElementById('image');
	image.style.display = 'block';
	image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message) {
      alert('Failed because: ' + message);
}

//get access to file and CREATE if does not exists
 function gotFS(fileSystem) {
    
 	fileSystem.getFile("test.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

//get file entry
function gotFileEntry(fileEntryURL) {
	console.log("got file entry");
	this.fileEntry = fileEntryURL
	fileEntry.file(gotFile, fail);
}

//get file itself
function gotFile(file){
    console.log("got file");
	readAsText(file);
}

//READ text from file - assumes that the file contains 
function readAsText(file) {
    console.log("readAsText");
	
	var reader = new FileReader();
	
	//assigns a callback function to be run once the file has been completely read
	reader.onloadend = function(evt) {
	
		//store the new string in 'filetext'
		filetext = evt.target.result;
	
        $('#textarea').val(filetext);
        
    };
	
	//begin reading the file
   	reader.readAsText(file);
}


//UDPATE file contents - called when submit button is pressed
function writeFile() {
    console.log("writeFile: "  + fileEntry.fullPath);
    
    filetext = $('#textarea').val();
    
	fileEntry.createWriter(
		function (writer) { 
			writer.write(filetext);
		}, 
		fail
	);

}
