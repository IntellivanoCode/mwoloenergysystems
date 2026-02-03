from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceTypeViewSet, CounterViewSet, TimeSlotViewSet,
    AppointmentViewSet, QueueTicketViewSet, DailyQueueStatsViewSet
)

router = DefaultRouter()
router.register(r'services', ServiceTypeViewSet, basename='service')
router.register(r'counters', CounterViewSet, basename='counter')
router.register(r'time-slots', TimeSlotViewSet, basename='timeslot')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'queue', QueueTicketViewSet, basename='queue')
router.register(r'stats', DailyQueueStatsViewSet, basename='stats')

urlpatterns = [
    path('', include(router.urls)),
]
