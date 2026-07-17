from rest_framework import viewsets
from .models import Ship, Route, Schedule, Passenger, Booking, Payment
from .serializers import (
    ShipSerializer, RouteSerializer, ScheduleSerializer, ScheduleDetailSerializer,
    PassengerSerializer, BookingSerializer, BookingDetailSerializer,
    PaymentSerializer, PaymentDetailSerializer
)

class ShipViewSet(viewsets.ModelViewSet):
    queryset = Ship.objects.all().order_by('-rating')
    serializer_class = ShipSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all().order_by('departure_date')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ScheduleDetailSerializer
        return ScheduleSerializer

class PassengerViewSet(viewsets.ModelViewSet):
    queryset = Passenger.objects.all()
    serializer_class = PassengerSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return BookingDetailSerializer
        return BookingSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return PaymentDetailSerializer
        return PaymentSerializer
