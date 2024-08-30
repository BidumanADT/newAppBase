from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        # Import models and permissions here to avoid accessing the app registry too early
        from django.contrib.auth.models import Group, Permission, User  # Import User here
        from django.contrib.contenttypes.models import ContentType

        # Call the function to create roles when the app is ready
        self.create_roles(Group, Permission, ContentType, User)

    def create_roles(self, Group, Permission, ContentType, User):
        """
        Create and assign permissions to the Superuser, Admin, Moderator, User, and Guest roles.
        """

        # Superuser role is inherently handled by Django's built-in superuser functionality.
        # Superusers have all permissions by default, so no need to explicitly define it here.

        # Create or get the Admin group
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        moderator_group, _ = Group.objects.get_or_create(name='Moderator') # ADDED BY JOSH
        user_group, _ = Group.objects.get_or_create(name='User')
        guest_group, _ = Group.objects.get_or_create(name='Guest')  # ADDED BY JOSH

        # Define permissions for the Admin group
        admin_permissions = [
            'view_user', 'change_user', 'delete_user',  # Permissions related to the User model
            # Add other relevant permissions for Admins here.
            # These will be dependent on the actual use case which has not yet been defined.
        ]

        # Get the content type for the User model
        user_content_type = ContentType.objects.get_for_model(User)  # Use the imported User model here

        # Assign permissions to the Admin group
        self.assign_permissions(admin_group, admin_permissions, user_content_type, Permission)

        # Define permissions for the Moderator group
        moderator_permissions = [       # ADDED BY JOSH
            'view_user', 'change_user', # Moderators can view and edit user details but cannot delete
            # Add other relevant permissions for Moderators here.
        ]
        # Assign permissions to the Moderator group
        self.assign_permissions(moderator_group, moderator_permissions, user_content_type, Permission)

        # Define permissions for the User group (typically limited to managing their own data)
        user_permissions = [
            'view_user', 'change_user'
            # Add other relevant permissions for Users here.
            # These will be dependent on the actual use case which has not yet been defined.
        ]

        # Assign permissions to the User group
        self.assign_permissions(user_group, user_permissions, user_content_type, Permission)

        # Define permissions for the Guest group
        guest_permissions = [   # ADDED BY JOSH
            'view_user',  # Guests may only be allowed to view users but not make any changes
            # Add other relevant permissions for Guests here.
        ]
        # Assign permissions to the Guest group
        self.assign_permissions(guest_group, guest_permissions, user_content_type, Permission)
        
        # Save the groups after assigning permissions
        admin_group.save()
        moderator_group.save()
        user_group.save()
        guest_group.save()

    def assign_permissions(self, group, permissions_list, content_type, Permission):
        """
        Helper function to assign a list of permissions to a specific group.
        """
        for perm in permissions_list:
            try:
                # Attempt to get the permission object based on codename and content type
                permission = Permission.objects.get(codename=perm, content_type=content_type)
                # Add the permission to the group
                group.permissions.add(permission)
            except Permission.DoesNotExist:
                print(f"Permission '{perm}' does not exist for content type '{content_type}'.")
                