from rest_framework import serializers
from .models import Ship, Route, Schedule, Passenger, Booking, Payment

class ShipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ship
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    duration_days = serializers.ReadOnlyField()

    class Meta:
        model = Schedule
        fields = '__all__'

class ScheduleDetailSerializer(serializers.ModelSerializer):
    ship = ShipSerializer(read_only=True)
    route = RouteSerializer(read_only=True)
    duration_days = serializers.ReadOnlyField()

    class Meta:
        model = Schedule
        fields = '__all__'

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class BookingDetailSerializer(serializers.ModelSerializer):
    passenger = PassengerSerializer(read_only=True)
    schedule = ScheduleDetailSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PaymentDetailSerializer(serializers.ModelSerializer):
    booking = BookingDetailSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
