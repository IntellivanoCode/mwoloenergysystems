from rest_framework import serializers
from .models import Ticket, TicketMessage

class TicketMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = TicketMessage
        fields = ['id', 'author', 'author_name', 'message', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'client', 'subject', 'description', 'priority', 'status', 'assigned_to', 'messages', 'created_at', 'updated_at', 'resolved_at']
        read_only_fields = ['created_at', 'updated_at', 'resolved_at']
