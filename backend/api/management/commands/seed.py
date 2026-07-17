import datetime
from django.core.management.base import BaseCommand
from api.models import Ship, Route, Schedule, Passenger, Booking, Payment

class Command(BaseCommand):
    help = 'Seeds the database with luxury ships, routes, schedules, passengers, bookings, and payments.'

    def handle(self, *args, **options):
        self.stdout.write("Cleaning database...")
        Payment.objects.all().delete()
        Booking.objects.all().delete()
        Passenger.objects.all().delete()
        Schedule.objects.all().delete()
        Route.objects.all().delete()
        Ship.objects.all().delete()

        self.stdout.write("Seeding ships...")
        ships_data = [
            {
                "name": "OceanAura Sovereign",
                "image": "sovereign",
                "rating": 4.9,
                "capacity": 1400,
                "ship_type": "Super Liner",
                "operator": "OceanAura Elite",
                "base_fare": 950.00
            },
            {
                "name": "Aura Majestic",
                "image": "majestic",
                "rating": 4.8,
                "capacity": 950,
                "ship_type": "Luxury Mega-Yacht",
                "operator": "OceanAura Elite",
                "base_fare": 1450.00
            },
            {
                "name": "Solace Horizon",
                "image": "horizon",
                "rating": 5.0,
                "capacity": 120,
                "ship_type": "Exclusive Superyacht",
                "operator": "OceanAura Private Collection",
                "base_fare": 3200.00
            },
            {
                "name": "Serenade of the Sea",
                "image": "serenade",
                "rating": 4.7,
                "capacity": 1800,
                "ship_type": "Liner Class",
                "operator": "Ritz-Carlton Yacht Collection",
                "base_fare": 800.00
            },
            {
                "name": "Starlight Odyssey",
                "image": "odyssey",
                "rating": 4.9,
                "capacity": 450,
                "ship_type": "Boutique Cruiser",
                "operator": "OceanAura Explorer",
                "base_fare": 1850.00
            },
            {
                "name": "Amber Wave",
                "image": "wave",
                "rating": 4.9,
                "capacity": 80,
                "ship_type": "Sailing Yacht",
                "operator": "OceanAura Private Collection",
                "base_fare": 2200.00
            }
        ]

        ships = {}
        for s in ships_data:
            ship = Ship.objects.create(**s)
            ships[s["name"]] = ship
            self.stdout.write(f"Created ship: {ship.name}")

        self.stdout.write("Seeding routes...")
        routes_data = [
            {"source_port": "Maldives", "destination_port": "Goa", "distance": 780},
            {"source_port": "Goa", "destination_port": "Lakshadweep", "distance": 320},
            {"source_port": "Lakshadweep", "destination_port": "Port Blair", "distance": 1200},
            {"source_port": "Port Blair", "destination_port": "Singapore", "distance": 900},
            {"source_port": "Dubai", "destination_port": "Mumbai", "distance": 1100},
            {"source_port": "Singapore", "destination_port": "Dubai", "distance": 3400},
            {"source_port": "Goa", "destination_port": "Maldives", "distance": 780},
            {"source_port": "Lakshadweep", "destination_port": "Dubai", "distance": 1600}
        ]

        routes = []
        for r in routes_data:
            route = Route.objects.create(**r)
            routes.append(route)
            self.stdout.write(f"Created route: {route}")

        self.stdout.write("Seeding schedules...")
        schedules_data = [
            {
                "ship": ships["OceanAura Sovereign"],
                "route": routes[0], # Maldives -> Goa
                "departure_date": datetime.date(2026, 8, 1),
                "return_date": datetime.date(2026, 8, 8)
            },
            {
                "ship": ships["Aura Majestic"],
                "route": routes[1], # Goa -> Lakshadweep
                "departure_date": datetime.date(2026, 8, 12),
                "return_date": datetime.date(2026, 8, 17)
            },
            {
                "ship": ships["Solace Horizon"],
                "route": routes[3], # Port Blair -> Singapore
                "departure_date": datetime.date(2026, 8, 20),
                "return_date": datetime.date(2026, 8, 27)
            },
            {
                "ship": ships["Serenade of the Sea"],
                "route": routes[4], # Dubai -> Mumbai
                "departure_date": datetime.date(2026, 9, 1),
                "return_date": datetime.date(2026, 9, 8)
            },
            {
                "ship": ships["Starlight Odyssey"],
                "route": routes[5], # Singapore -> Dubai
                "departure_date": datetime.date(2026, 9, 15),
                "return_date": datetime.date(2026, 9, 25)
            },
            {
                "ship": ships["Amber Wave"],
                "route": routes[6], # Goa -> Maldives
                "departure_date": datetime.date(2026, 8, 5),
                "return_date": datetime.date(2026, 8, 10)
            },
            {
                "ship": ships["OceanAura Sovereign"],
                "route": routes[2], # Lakshadweep -> Port Blair
                "departure_date": datetime.date(2026, 8, 15),
                "return_date": datetime.date(2026, 8, 24)
            },
            {
                "ship": ships["Solace Horizon"],
                "route": routes[7], # Lakshadweep -> Dubai
                "departure_date": datetime.date(2026, 9, 10),
                "return_date": datetime.date(2026, 9, 18)
            }
        ]

        schedules = []
        for s in schedules_data:
            sched = Schedule.objects.create(**s)
            schedules.append(sched)
            self.stdout.write(f"Created schedule: {sched}")

        self.stdout.write("Seeding passengers...")
        passengers_data = [
            {"name": "James Bond", "email": "james@mi6.gov.uk", "phone": "+44 7700 900007", "passport_number": "GB007M"},
            {"name": "Tony Stark", "email": "tony@starkindustries.com", "phone": "+1 555-0100", "passport_number": "US8834928"},
            {"name": "Alice Smith", "email": "alice@domain.com", "phone": "+1 555-0182", "passport_number": "US1923891"},
            {"name": "VIP Traveler", "email": "vip@oceanaura.com", "phone": "+1 555-0199", "passport_number": "US9876543"}
        ]

        passengers = {}
        for p in passengers_data:
            passenger = Passenger.objects.create(**p)
            passengers[p["name"]] = passenger
            self.stdout.write(f"Created passenger: {passenger.name}")

        self.stdout.write("Seeding bookings and payments...")
        # 1. James Bond Booking: Solace Horizon (schedule index 2, Port Blair -> Singapore)
        # Cabin: VIP Owner Suite (multiplier 2.5), 2 guests. Base rate: $3200
        # Formula: ($3200 * 2.5) * 2 guests = $16000 + 12% tax ($1920) = $17920
        b1 = Booking.objects.create(
            passenger=passengers["James Bond"],
            schedule=schedules[2],
            cabin_type="VIP Cabin",
            passenger_count=2,
            total_fare=17920.00,
            status="confirmed"
        )
        Payment.objects.create(
            booking=b1,
            amount=17920.00,
            payment_method="Credit Card",
            transaction_id="TXN_JAMES007",
            status="success"
        )

        # 2. Tony Stark Booking: Solace Horizon (schedule index 7, Lakshadweep -> Dubai)
        # Cabin: VIP Owner Suite (multiplier 2.5), 1 guest. Base rate: $3200
        # Formula: ($3200 * 2.5) * 1 guest = $8000 + 12% tax ($960) = $8960
        b2 = Booking.objects.create(
            passenger=passengers["Tony Stark"],
            schedule=schedules[7],
            cabin_type="VIP Cabin",
            passenger_count=1,
            total_fare=8960.00,
            status="confirmed"
        )
        Payment.objects.create(
            booking=b2,
            amount=8960.00,
            payment_method="UPI",
            transaction_id="TXN_STARKVIP",
            status="success"
        )

        # 3. Alice Smith Booking: OceanAura Sovereign (schedule index 0, Maldives -> Goa)
        # Cabin: Suite (multiplier 1.5), 2 guests. Base rate: $950
        # Formula: ($950 * 1.5) * 2 = $2850 + 12% tax ($342) = $3192
        b3 = Booking.objects.create(
            passenger=passengers["Alice Smith"],
            schedule=schedules[0],
            cabin_type="Suite",
            passenger_count=2,
            total_fare=3192.00,
            status="pending"
        )
        Payment.objects.create(
            booking=b3,
            amount=3192.00,
            payment_method="Net Banking",
            transaction_id="TXN_ALICEPENDING",
            status="pending"
        )

        # 4. VIP Traveler Booking: Aura Majestic (schedule index 1, Goa -> Lakshadweep)
        # Cabin: Suite (multiplier 1.5), 2 guests. Base rate: $1450
        # Formula: ($1450 * 1.5) * 2 = $4350 + 12% tax ($522) = $4872
        b4 = Booking.objects.create(
            passenger=passengers["VIP Traveler"],
            schedule=schedules[1],
            cabin_type="Suite",
            passenger_count=2,
            total_fare=4872.00,
            status="confirmed"
        )
        Payment.objects.create(
            booking=b4,
            amount=4872.00,
            payment_method="Credit Card",
            transaction_id="TXN_VIPCONFIRMED",
            status="success"
        )

        self.stdout.write(self.style.SUCCESS("Database seeding with bookings and payments completed successfully!"))
