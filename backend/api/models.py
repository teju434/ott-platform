from django.db import models

class Ship(models.Model):
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=500, blank=True, null=True)
    rating = models.FloatField(default=5.0)
    capacity = models.IntegerField(default=1000)
    ship_type = models.CharField(max_length=50) # e.g. Luxury Liner, Superyacht
    operator = models.CharField(max_length=100) # e.g. OceanAura Elite, Ritz-Carlton
    base_fare = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Route(models.Model):
    source_port = models.CharField(max_length=100)
    destination_port = models.CharField(max_length=100)
    distance = models.IntegerField(help_text="Distance in nautical miles")

    def __str__(self):
        return f"{self.source_port} to {self.destination_port}"

class Schedule(models.Model):
    ship = models.ForeignKey(Ship, on_delete=models.CASCADE, related_name="schedules")
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="schedules")
    departure_date = models.DateField()
    return_date = models.DateField()

    @property
    def duration_days(self):
        return (self.return_date - self.departure_date).days

    def __str__(self):
        return f"{self.ship.name} | {self.route} | {self.departure_date}"

class Passenger(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    passport_number = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ]
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name="bookings")
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name="bookings")
    cabin_type = models.CharField(max_length=50) # Economy, Deluxe, Suite, Family Cabin, VIP Cabin
    passenger_count = models.IntegerField(default=1)
    total_fare = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} | {self.passenger.name} | {self.status}"

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed')
    ]
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50) # UPI, Credit Card, Debit Card, Wallet, Net Banking
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} | {self.status}"
