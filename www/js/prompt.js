(function($){

  var Prompt = Backbone.Model.extend({

    defaults: {
      "prompt_id": '', // ids correspond to prompt flow diagram
      "questionText" : '',
    }

  });

  var PromptSet = Backbone.Collection.extend({

    model: Prompt

  });

  var PromptResponse = Backbone.Model.extend({

    defaults: {
      "participant_id": "test - " + new Date(new Date().getTime()).toString(),
      "prompt_id": '',
      "response": '',
    },

  });

  var AdherenceResponse = Backbone.Collection.extend({

    // all prompt responses are grouped into one Adherence Response
    model: PromptResponse

  });

  var PromptView = Backbone.View.extend({
    el: $('form'),

    events: {

    },

    initialize: function(){
      _.bindAll(this, 'render');
    },

    // render a form for a single prompt
    render: function(){

      $('body').append('<p>' + this.model.get('questionText') + '</p>');
      return this;
    },

  });

  var AdherenceView = Backbone.View.extend({
    el: $('body'),

    events: {
      'submit' : function(e) {
        this.postAdherenceResponse(e);
        this.showNextPrompt(e);
      }

    },

    initialize: function(){
      _.bindAll(this, 'render', 'postAdherenceResponse', 'showNextPrompt');

      this.collection = new PromptSet();
      // this.collection.bind('add', this.appendItem); // collection event binder

      this.render();
    },

    render: function(){

      var prompt = new Prompt();

      // todo: set these in showNextPrompt
      // or figure out where to set these in general
      prompt.set({

        prompt_id: 'q1a',
        questionText: 'Did you take your medication today?',

      });

      this.collection.add(prompt);

      var promptView = new PromptView({
        model: prompt
      });

      $(this.el).append(promptView.render().el);

    },

    showNextPrompt: function(){

      // based on the user response
      // and the current prompt id
      // show them the next prompt or
      // give feedback

      prompt.set({
        prompt_id: 'q2a',
        questionText: 'Do you plan to take your medication?',
      });

    },

    postAdherenceResponse: function(){

      // how to grab this id when i create the prompt in a different fn?
      var prompt_id = this.model.get('prompt_id');
      // var prompt_id = 'q1a';

      var form = $(document.base);
      var answer = JSON.stringify(form.serializeArray());

      // todo build aherence response hash based on successive prompts
      var promptResponse = new PromptResponse();

      promptResponse.set({

        prompt_id: prompt_id,
        response: answer,

      });

      var adherenceResponse = JSON.stringify(promptResponse);

      var report = $.ajax({
        url: 'http://localhost:3000/reports.json',
        type: 'POST',
        contentType:'application/json',
        data: adherenceResponse,

        // currently success callback not firing
        // seems to be part of cors suite of annoyances
        success: function(){

          alert("data sent. thanks for letting us know!");

        },

        // add payload to local storage to post later
        error: function(){

          payloadDateTag = 'adherence: ' + new Date(new Date().getTime()).toString();

          // todo store these under 'adherence' namespace
          window.localStorage.setItem(payloadDateTag, adherenceResponse);
          alert("we stored your data to send later.");

        },

      });
    },


    addPromptResponse: function(){

      // for multiple stage responses, concatenate into one payload

    },

  });

  var adherenceView = new AdherenceView();

})(jQuery);
