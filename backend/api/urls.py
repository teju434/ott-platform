from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShipViewSet, RouteViewSet, ScheduleViewSet,
    PassengerViewSet, BookingViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register(r'ships', ShipViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'passengers', PassengerViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
