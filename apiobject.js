
/**
 *
 * API OBJECT
 * @author Victor Aurélio
 */

ApiObject = function(data){    
    for(property in data){
        this[property] = data[property];
    }
    this._init();
};
ApiObject.prototype = {
    seq: [], // Composite keys are acceptable. Default: sequence primary keys
    name: "Name of object", // To show erros and default to url api
    attr: [], // Atributtes of object    
    u_insert: null,
    u_update: null,
    u_get: null,
    u_get_table: null,
    u_delete: null,
    tableName: null,
    tableObject: null,    
    selectToTable: null,
    _defaultInsertSuccess: "Inserido com sucesso!",
    _defaultInsertError: "Error ao inserir",
    _init: function(){
        this.selectToTable = 'select.toTable' + this.name.capitalizeFirstLetter();
        this.tableName =  "table#" + this.name;//default:  table#nameOfObjectInTable
        this.u_insert = (isNotNull(this.u_insert) ? this.u_insert : this.name);
        this.u_update = (isNotNull(this.u_update) ? this.u_update : this.name);
        this.u_get = (isNotNull(this.u_get) ? this.u_get : this.name);
        this.u_get_table = (isNotNull(this.u_get_table) ? this.u_get_table : this.name)+ '/table';// If exists a select type    
        this.u_delete = (isNotNull(this.u_delete) ? this.u_delete : this.name);        
    },
    get: function(){
        return $.ajax({
            context: this,
            url: getUrlRequest(this.u_get + ""),
            type: "GET",            
            error: function (xhr) {
                console.log("Error on get for " + this.u_get);
            },
            success: function(result){
              this.attr = result['data'];
            }
        });
    },
    getFull: function(){
        return $.ajax({
            context: this,
            url: getUrlRequest(this.u_get + '/full'),
            type: "GET",
            data: {seq: this.seq},
            error: function (xhr) {
                console.log("Error on getFull for " + this.u_get+'/full');
            },
            success: function(result){                
                this.attr = result['data'];
                if(isNotNull(this.attr[0])){//A vector ?
                    for(property in this.attr[0]){//Adding property inside vetor to attr
                        this.attr[property] = this.attr[0][property];
                    }
                }
                delete this.attr[0];//Delete vetor
            }
        });    
    },
    getForTable: function(){
        if(typeof(this.tableObject) === "function"){
            this.tableObject();
        }else{
            this.tableObject.clear().draw();
            this.tableObject.ajax.url(getUrlRequest(this.u_get_table + (isNotNull($(this.params())) ? "/" + JSON.stringify( this.params() ): "")));
            console.log(this.tableObject.ajax.url());
            this.tableObject.ajax.reload();
            this.tableObject.draw(true);
        }
    },    
    insert: function(name, success, error, type, excludes){
        //everything on attr will be passed in ajax's data option, but we can excludes some of them or everybody
        name = typeof name !== 'undefined' ? name : this.name;
        success = typeof success !== 'undefined' ? success : this._defaultInsertSuccess;
        error = typeof error !== 'undefined' ? error : this._defaultInsertError;
        type = typeof type !== 'undefined' ? type : "POST";
        
       if(type != "POST" && !type)
           throw new Error("Only POST request are acceptable");

       var att = this.attr;

       if(excludes){
         for(var i = 0; i < excludes.length; i++){
            if((index = att.indexOf(excludes[i])) != -1)
               att.splice(index, 1);
         }
       }
              
       return $.ajax({url: getUrlRequest(name), type: type, data: att, success: success, error: error}); 
    },
    update: function(name, success, error, type, excludes){
        //everything on attr will be passed in ajax's data option, but we can excludes some of them or everybody
        name = typeof name !== 'undefined' ? name : this.name;
        success = typeof success !== 'undefined' ? success : this._defaultInsertSuccess;
        error = typeof error !== 'undefined' ? error : this._defaultInsertError;
        type = typeof type !== 'undefined' ? type : "PUT";
        
       if(type != "PUT" && !type)
           throw new Error("Only PUT request are acceptable");

       var att = this.attr;

       if(excludes){
         for(var i = 0; i < excludes.length; i++){
            if((index = att.indexOf(excludes[i])) != -1)
               att.splice(index, 1);
         }
       }
                
       return $.ajax({url: getUrlRequest(name), type: type, data: att, success: success, error: error}); 
    },
    delete: function(success, error, type, data){
       if(type != "POST" || type != "DELETE")
         throw new Error("Only DELETE or POST requests are acceptable");
      
       if(seq.length > 1){
          var seq = JSON.stringify(this.seq);
       }else if(seq.length === 0){
          var seq = this.seq[0];
       }else{
          throw new Error("I need a Senzu Bean, Vegeta :(");
       }

       var _success = success || this._defaultInsertSuccess;
       var _error = error || this._defaultInsertError;

       return $.ajax({url: "",  data: seq, type: type, success: _success, error: _error}); 
    },
    getAndAfterGoToHtml: function(){      
        $.when(this.get()).done(this.toHtml);    
    }
};


function isNotNull(obj){        
    if(arguments.length > 1){
        for(var i=0; i<arguments.length; i++) {
           if(! isNotNull(arguments[i])) return false;
        }
        return true;
    }else{
        return obj != null && obj != undefined && obj != "";
    }
}

function getUrlRequest(requirement){
    var protocolo = window.location.protocol;
    var url = window.location.hostname;
    //var url_origem = protocolo + "//" + url + "/www/_admin/_server/admin/" + requirement;
    var url_origem = "myurl/url/url" + requirement;
    return url_origem;
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}