(function($) {

    $(document).ready(function() {

	window.defaultMyAudio =
	    new MyAudio({filename: 'testaudio.wav',
			 data: 'img/speech.png',
			 bucket: 'spreza-audio',
			 acl: 'private',
			 successActionRedirect: 'http://spreza.ca/welldone.html',
			 contentType: 'audio/',
			 folder: 'test/',
			 AWSAccessKeyId: 'AKIAJXNDSQ367JCU3CQQ',
			 AWSSecretKeyId: 'Yt1JqIAG3XPBJ1sZBu5om3FH+5lbTnZzTG/dEH1m'
			});

	window.AudioPreviewView =
	    new AudioPreviewView({model: window.defaultMyAudio});
	window.AudioFileView =
	    new AudioFileView({model: window.defaultMyAudio});

	window.App = new window.AudioRouter();
	Backbone.history.start();
    });

})(jQuery);
