#include "trilobot.h"
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <string.h>


#define MAX_CITIES 10
#define MAX_CITY_NAME 50

void update_city_from_config();
void print_current_time() ;
const char* get_random_city();

char cities[MAX_CITIES][MAX_CITY_NAME];  // Stores city names
int city_count = 0;
int current_city_index = 0;  // Keep track of the current city

void update_city_from_config() {
    FILE *file = fopen("config.txt", "r");
    if (file) {
        char line[256];  // Read the entire line
        if (fgets(line, sizeof(line), file)) {
            fclose(file);

            // Remove newlines and brackets
            line[strcspn(line, "\r\n")] = 0;  // Remove trailing newline
            if (line[0] == '[') memmove(line, line + 1, strlen(line));  // Remove leading [
            if (line[strlen(line) - 1] == ']') line[strlen(line) - 1] = 0;  // Remove trailing ]

            // Tokenize using ", " as delimiter
            char *token = strtok(line, ", ");
            while (token && city_count < MAX_CITIES) {
                strncpy(cities[city_count], token, MAX_CITY_NAME - 1);
                cities[city_count][MAX_CITY_NAME - 1] = '\0';  // Ensure null termination
                city_count++;
                token = strtok(NULL, ", ");
            }
        }
    } else {
        printf("Error: Could not open config.txt\n");
    }
}

// Function to get the next city in order
const char* get_next_city() {
    if (city_count == 0) return "Unknown";

    // If we reach the last city, stop the car
    if (current_city_index >= city_count) {
        printf("🚗 Destination reached: %s. Stopping the car.\n", cities[city_count - 1]);
        motor_stop();  // Stop the vehicle
        exit(0);  // Exit the program
    }

    const char* city = cities[current_city_index];
    current_city_index++;  // Move to the next city

    return city;
}

// Function to print the current time
void print_current_time() {
    time_t now = time(NULL);
    struct tm *timeinfo = localtime(&now);
    printf("[Time] %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
}


int main(void) {
     // Initialize the bot.
     if (initialize_bot() != SUCCESS) {
        fprintf(stderr, "Bot initialization failed\n");
        return EXIT_FAILURE;
    }
    
    // Install SIGINT handler for safe shutdown.
    signal(SIGINT, motor_sigint_handler);
    if (motor_init() != GPIO_SUCCESS) {
        fprintf(stderr, "Motor initialization failed\n");
        return EXIT_FAILURE;
    }
    
    float distance;

 
    // Initialize the ultrasonic sensor.
    if (ultrasonic_init() != SUCCESS) {
        fprintf(stderr, "Ultrasonic sensor initialization failed\n");
        return EXIT_FAILURE;
    }
    srand(time(NULL));  // Seed the random number generator

    // Read city names from config
    update_city_from_config();

    // Allow the sensor to settle.
    sleep(2);
    int temp=0;
    // Continuously measure and print the distance.
    while (1) {
        if (ultrasonic_read_distance(&distance) == SUCCESS) {
            printf("Distance: %.2f cm\n", distance);
        } else {
            printf("Error reading distance\n");
        }
        float current_distance = distance;

         // Print the next city in order every few iterations
        if (temp % 11 == 0){
            printf("\nTraversing through: %s\n", get_next_city());
            printf("Time: ");
            print_current_time();
            printf("\n");
        }
         
        if (current_distance >= 50) {
            printf("Path clear, moving forward.\n");
            motor_right_forward();
            motor_left_forward();
            motor_set_speed(70.0);
            sleep(0.5);
        } else if (current_distance >= 21) {
            printf("Caution: Reducing speed.\n");
            motor_set_speed(50.0);
            sleep(0.5);
        } else if (current_distance >= 9) {
            printf("Obstacle detected: Turning.\n");
            if (rand() % 2 == 0) {
                motor_turn_left();
            } else {
                motor_turn_right();
            }
            motor_set_speed(40.0);
            sleep(0.5);
        } else {
            printf("Too close! Stopping and reversing.\n");
            motor_stop();
            sleep(0.2);
            motor_right_reverse();
            motor_left_reverse();
            motor_set_speed(40.0);
            sleep(0.3);
        }
        usleep(300000);  // Delay 100 ms between measurements.
        temp ++;
    }


    return EXIT_SUCCESS;
}

