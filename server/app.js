Posts.allow({
    update: function(userId, post) {
        return true;
    },
    remove: function(userId, post) {
        return userId;
    },
});
