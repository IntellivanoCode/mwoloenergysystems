from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet, LeaveTypeViewSet, LeaveViewSet, AttendanceViewSet, PayrollViewSet,
    EmployeeBadgeViewSet, BadgeScanView, BadgeScanLogViewSet
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'leave-types', LeaveTypeViewSet, basename='leave-type')
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'attendances', AttendanceViewSet, basename='attendance')
router.register(r'payrolls', PayrollViewSet, basename='payroll')
router.register(r'badges', EmployeeBadgeViewSet, basename='badge')
router.register(r'badge-logs', BadgeScanLogViewSet, basename='badge-log')

urlpatterns = [
    path('badge-scan/', BadgeScanView.as_view(), name='badge-scan'),
    path('', include(router.urls)),
]
