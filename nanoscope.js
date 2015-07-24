Posts = new Mongo.Collection('posts');
Posts.allow({
  update: function (userId, post) {
    return true;
  },
  remove: function (userId, post) {
    return userId
  }
});

Meteor.methods({
  post: function (title, url) {
    var A = Meteor.user();
    var post = {
      userId: A && A._id,
      author: A && A.emails[0].address,
      title: title,
      url: url,
      votes: 0,
      upvoters: []
    };

    Posts.insert(post);
  },
  downvote: function (postId) {
    var user = Meteor.user();
    if (!user) {
      if (Meteor.isClient) {
        alert("you must be logged in");
      }
      return;
    }

    Posts.update({
      _id: postId,
      upvoters: user._id
    }, {
      $pull: {upvoters: user._id},
      $inc: {votes: -1}
    });
  },
  upvote: function (postId) {
    var user = Meteor.user();
    if (!user) {
      if (Meteor.isClient) {
        alert("you must be logged in");
      }
      return;
    }

    Posts.update({
      _id: postId,
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});

if (Meteor.isClient) {
  Template.postItem.helpers({
    upvotedClass: function () {
      var userId = Meteor.userId();
      if (!_.include(this.upvoters, userId)) {
        return 'btn-primary upvotable';
      } else {
        return 'downvotable';
      }
    },
    counter: function () {
     return this.votes > 1 ? "votes" : "vote";
    }
  });

  Template.posts.helpers({
    posts: function () {
      return Posts.find();
    }
  });

  Template.postSubmit.events({
    'submit form': function (e) {
      e.preventDefault();

      var post = {
        url: $(e.target).find('[name=url]').val(),
        title: $(e.target).find('[name=title]').val(),
      }

      Meteor.call('post', post.title, post.url);
    }
  });

  Template.postItem.events({
    'click .upvotable': function (e) {
      e.preventDefault();
      Meteor.call('upvote', this._id);
    },
    'click .downvotable': function (e) {
      e.preventDefault();
      Meteor.call('downvote', this._id);
    }
  });

}
