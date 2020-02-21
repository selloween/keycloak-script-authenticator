AuthenticationFlowError = Java.type("org.keycloak.authentication.AuthenticationFlowError");
FormMessage = Java.type('org.keycloak.models.utils.FormMessage');

function getGroups(context, checkRoles) {

    var groups = user.getGroups();
    var groupArray = groups.toArray();

    for (var i in groupArray) {

        var group = groupArray[i]
        var groupName = group.getName();

        if (groupName === "blocked") {
            context.failure(AuthenticationFlowError.USER_DISABLED);
            return;
        }
        if (checkRoles) {

            var client = session.getContext().getClient();
            var rolesClient = group.getClientRoleMappings(client);
            var rolesClientArray = rolesClient.toArray();

            for (var x in rolesClientArray) {
                var roleName = rolesClientArray[x].getName();

                if (roleName === "allow_access") {
                    context.success();
                    return;
                }
            }
        }
    }
}

function authenticate(context) {

    LOG.info(script.name + " --> trace auth for: " + user.username);

    getGroups(context, false);
    getGroups(context, true);

    context.forkWithErrorMessage(new FormMessage('label', 'Your account is currently not authorized to access  <b>' + session.getContext().getClient().getName() + '</b>' ));
    return;
}