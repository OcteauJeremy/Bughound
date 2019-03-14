from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework.exceptions import NotFound


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')
        extra_kwargs = {
            'name': {
                'validators': []
            }
        }


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    group_id = serializers.IntegerField()

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()

        return self.validated_data

    def save(self, request):

        try:
            group = Group.objects.get(id=request.data['group_id'])
        except ObjectDoesNotExist:
            raise NotFound(detail='Group_id not found')

        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.groups.add(group)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)
    id = serializers.IntegerField()

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username')
        instance.email = validated_data.get('email')
        instance.first_name = validated_data.get('first_name')
        instance.last_name = validated_data.get('last_name')

        groups_validated = validated_data.get('groups')
        instance_groups = instance.groups.all()
        if instance_groups[0].name != groups_validated[0]['name']:
            try:
                group = Group.objects.get(name=groups_validated[0]['name'])
            except ObjectDoesNotExist:
                raise NotFound(detail='This group doesn\'t exist')
            instance.groups.set([group])
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('username', 'email', 'id', 'first_name', 'last_name', 'is_superuser', 'groups')
        read_only_fields = ('id',)
        extra_kwargs = {
            'groups': {
                'validators': []
            },
            'username': {
                'validators': []
            }
        }


class UserDetailsSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)

    class Meta:
        model = User
        fields = '__all__'
