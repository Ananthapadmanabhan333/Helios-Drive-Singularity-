from typing import Annotated, TypedDict, List
from langgraph.graph import StateGraph, END
import random

class VehicleState(TypedDict):
    vehicle_id: str
    position: tuple
    velocity: float
    detected_objects: List[dict]
    active_decision: str
    risk_level: float
    history: List[str]

def perception_agent(state: VehicleState):
    """Analyzes raw sensor data and updates the world state."""
    # Mock perception logic
    risk = random.uniform(0, 0.1)
    if random.random() > 0.95:
        risk = random.uniform(0.5, 0.9) # High risk scenario
    
    return {
        **state,
        "risk_level": risk,
        "detected_objects": [{"type": "car", "dist": 10}, {"type": "pedestrian", "dist": 50}]
    }

def planning_agent(state: VehicleState):
    """Determines the optimal trajectory based on perception."""
    if state["risk_level"] > 0.5:
        decision = "EMERGENCY_RECOVERY"
    else:
        decision = random.choice(["LANE_FOLLOW", "LANE_CHANGE", "OPTIMIZE_VELOCITY"])
    
    return {
        **state,
        "active_decision": decision,
        "history": state["history"] + [decision]
    }

def safety_verification_agent(state: VehicleState):
    """Final guardrail to ensure the planned action is safe."""
    if state["active_decision"] == "EMERGENCY_RECOVERY":
        return state # Keep emergency decision
    
    # Random safety check
    if state["risk_level"] > 0.3:
        return {**state, "active_decision": "INCREASE_GAP"}
    
    return state

def recovery_agent(state: VehicleState):
    """Handles autonomous recovery after a high-risk event."""
    if state["active_decision"] == "EMERGENCY_RECOVERY":
        # Simulate recovery logic
        return {**state, "active_decision": "SAFE_STOP", "risk_level": 0.1}
    return state

def simulation_control_agent(state: VehicleState):
    """Orchestrates the synthetic environment based on vehicle behavior."""
    # Adjust weather/traffic based on vehicle performance
    return state

# Define the Graph
workflow = StateGraph(VehicleState)

workflow.add_node("perception", perception_agent)
workflow.add_node("planning", planning_agent)
workflow.add_node("safety", safety_verification_agent)
workflow.add_node("recovery", recovery_agent)
workflow.add_node("simulation", simulation_control_agent)

workflow.set_entry_point("perception")
workflow.add_edge("perception", "planning")
workflow.add_edge("planning", "safety")
workflow.add_edge("safety", "recovery")
workflow.add_edge("recovery", "simulation")
workflow.add_edge("simulation", END)

app_graph = workflow.compile()

def run_autonomy_cycle(vehicle_id: str):
    initial_state = {
        "vehicle_id": vehicle_id,
        "position": (0, 0),
        "velocity": 60.0,
        "detected_objects": [],
        "active_decision": "IDLE",
        "risk_level": 0.0,
        "history": []
    }
    return app_graph.invoke(initial_state)
