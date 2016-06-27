$(document).ready(function() {

    window.MyAudio = Backbone.Model.extend({
	setFromFile: function(file) {
	    var reader = new FileReader();
	    self = this;

	    // Closure to capture the file information.
	    reader.onload = (function(f) {
		return function(e) {
		    self.set({filename: f.name})
		    self.set({data: e.target.result});
		    self.updatePolicy();
		};
	    })(file);

	    // Read in the audio file as a data URL.
	    reader.readAsDataURL(file);
	},

	initialize: function(){
	    this.updatePolicy();
	},

	updatePolicy: function(){
	    var key = this.get('folder') + this.get('filename');
	    this.set({key: key});

	    POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
			    "conditions": [
				["eq", "$bucket", this.get('bucket')],
				["starts-with", "$key", this.get('key')],
				{"acl": this.get('acl')},
				{"success_action_redirect": this.get('successActionRedirect')},
				{"x-amz-meta-filename": this.get('filename')},
				["starts-with", "$Content-Type", this.get('contentType')]
			    ]
			  };

	    var secret = this.get('AWSSecretKeyId');
	    var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
	    var signature = b64_hmac_sha1(secret, policyBase64);
	    
	    this.set({POLICY: policyBase64 });
	    this.set({SIGNATURE: signature });	  
	}

    });

    window.AudioFileView = Backbone.View.extend({
	events: {
	    'change #myAudio': 'dispatchUpdatePreview'
	},

	template: _.template($("#audio-file-template").html()),

	initialize: function() {
	    _.bindAll(this, 'render');
	},

	render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    metaView = new AudioMetaView({model: window.defaultMyAudio});
	    $formBlob = this.$("#formBlob");
	    $formBlob.prepend(metaView.render().el);
	    return this;
	},

	dispatchUpdatePreview: function(e) {
	    //In production we would really dispatch an event
	    //but instead, for the demo, call model function directly
	    this.model.setFromFile(e.target.files[0]);
	}
    });

    window.AudioMetaView = Backbone.View.extend({
	template: _.template($("#audio-meta-template").html()),

	initialize: function() {
	    _.bindAll(this, 'render');
	    this.model.bind("change", this.render);
	},

	render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	},
    });

    window.AudioPreviewView = Backbone.View.extend({
	template: _.template($("#audio-preview-template").html()),

	initialize: function() {
	    _.bindAll(this, 'render');
	    this.model.bind('change', this.render);
	},

	render: function(){
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	}
    });

    window.AudioRouter = Backbone.Router.extend({
	routes: {
	    '': 'home'
	},

	home: function(){
	    $('#container').empty();     
 	    $('#container').append(window.AudioPreviewView.render().el);  
	    $('#container').append(window.AudioFileView.render().el);  
	}
    });

});