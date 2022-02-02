from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)


class UserManager(BaseUserManager):
    def create_user(self, rollNo, email, name, password, phoneNo):
        if rollNo is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(username=rollNo, email=self.normalize_email(email))
        user.set_password(password)
        user.name = name
        user.phoneNo = phoneNo
        user.save()

        return user

    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.save()

        return user


class Students(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    rollNo = models.CharField(max_length=20, unique=True)
    phoneNumber = models.CharField(max_length=20)
    email = models.EmailField(max_length=50)
    isAlloted = models.BooleanField(default=False)
    password = models.CharField(max_length=20)

    USERNAME_FIELD = 'rollNo'
    
    class Meta:
        ordering = ['id']

class Rooms(models.Model):
    id = models.AutoField(primary_key=True)
    roomNo = models.CharField(max_length=20)
    rollNo = models.CharField(max_length=20,default="0")

    class Meta:
        ordering = ['id']