from rest_framework import serializers
from rooms.models import Rooms, Students

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = ['id', 'roomNo', 'rollNo']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['id', 'name', 'rollNo', 'phoneNumber', 'email', 'isAlloted','password']