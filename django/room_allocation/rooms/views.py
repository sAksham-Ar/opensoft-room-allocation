import email
from unicodedata import name
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rooms.models import Rooms, Students
from rooms.serializers import RoomSerializer, StudentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken

class RoomList(APIView):
    """
    List all rooms, or create a new room.
    """
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        snippets = Rooms.objects.all()
        serializer = RoomSerializer(snippets, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserDetail(APIView):
    permission_classes = (IsAuthenticated,)
    def get_object(self, rollNo):
        try:
            return Students.objects.get(rollNo=rollNo)
        except Students.DoesNotExist:
            raise Http404

    def get(self, request, rollNo, format=None):
        student = self.get_object(rollNo)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

class Register(APIView):
    def post(self, request, format=None):
        rollNo = request.data['rollNo']
        email = request.data['email']
        name = request.data['name']
        password = request.data['password']
        phoneNumber = request.data['phoneNumber']
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode(),salt)
        try:
            student = Students.objects.get(rollNo=rollNo)
            return Response({"detail":"User already exists"}, status=status.HTTP_400_BAD_REQUEST)
        except Students.DoesNotExist:
            student = Students(rollNo=rollNo, email=email, name=name, password=hashed.decode("utf-8"), phoneNumber=phoneNumber)
            student.save()
            return Response({"detail":"User created successfully"}, status=status.HTTP_201_CREATED)


class Login(APIView):
    def get_object(self, rollNo):
        try:
            return Students.objects.get(rollNo=rollNo)
        except Students.DoesNotExist:
            raise Http404

    def post(self, request, format=None):
        rollNo = request.data['rollNo']
        password = request.data['password']
        student = self.get_object(rollNo)
        hashed = bcrypt.hashpw(password.encode("utf-8"),student.password.encode("utf-8"))
        if student is None or student.password.encode("utf-8") != hashed:
            return Response({"detail":"Username or password is incorrect"},status=status.HTTP_400_BAD_REQUEST)
        refresh = RefreshToken.for_user(student)
        return Response({
            'refreshToken': str(refresh),
            'accessToken': str(refresh.access_token),
            'name': student.name,
            'rollNo': student.rollNo,
        })

class Book(APIView):
    permission_classes = (IsAuthenticated,)
    def get_object(self, rollNo):
        try:
            return Students.objects.get(rollNo=rollNo)
        except Students.DoesNotExist:
            raise Http404

    def post(self, request, format=None):
        rollNo = request.data['rollNo']
        roomNo = request.data['roomNo']
        student = self.get_object(rollNo)
        if student is None:
            return Response({"detail": "User does not exist"},status=status.HTTP_400_BAD_REQUEST)
        room = Rooms.objects.get(roomNo=roomNo)
        if room is None:
            return Response({"message": "Room does not exist"},status=status.HTTP_400_BAD_REQUEST)
        if student.isAlloted:
            return Response({"detail": "User already booked"},status=status.HTTP_400_BAD_REQUEST)
        if room.rollNo == "0":
            room.rollNo = rollNo
            room.save()
            student.isAlloted = True
            student.save()
            return Response(status=status.HTTP_200_OK)
        return Response({"detail": "Room already booked"}, status=status.HTTP_400_BAD_REQUEST)