 Template.posts.helpers({
     posts: function() {
        Tracker.autorun(function () {

            console.log(this.filter);
        });

            switch (Session.get('tri')) {
                case 'vote': {
                    return Posts.find({}, {
                        sort: {
                            'votes': -1,
                        }
                    });
                }

                case 'name': {
                    return Posts.find({}, {
                        sort: {
                            'name': -1,
                        }
                    });
                }

                default: {
                    return Posts.find();
                }
            }
     }
 });

Template.posts.onCreated(function() {
  this.filter = new ReactiveVar();
});

Template.posts.events({
    'click .dropdown-menu a': function(e, t) {
        e.preventDefault();
        var param = $(e.target).attr("href").replace("#","");
        var concept = e.target.text;
        $('.search-panel span#search_concept').text(concept);
        Session.set('tri', param);
    },
    'keyup #search': function(e, t) {
        t.filter.set(e.target.value);
    }
});